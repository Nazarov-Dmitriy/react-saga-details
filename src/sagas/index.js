import { takeLatest, put, spawn, retry } from "redux-saga/effects";
import { LIST_DETAILS_REQUEST, DETAILS_REQUEST } from "../actions/actionTypes";
import {
  addListFailure,
  addListSuccess,
  addDetailsFailure,
  addDetailsSuccess,
} from "../actions/actionsCreators";

const addListRequest = async () => {
  const response = await fetch("http://localhost:7070/api/services");
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

const addDetailsRequest = async (id) => {
  const response = await fetch(`http://localhost:7070/api/services/${id}`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

// worker
function* handleListSaga(action) {
  try {
    const data = yield addListRequest();
    yield put(addListSuccess(data));
  } catch (e) {
    yield put(addListFailure(e.message));
  }
}

// watcher
function* watchGetList() {
  yield takeLatest(LIST_DETAILS_REQUEST, handleListSaga);
}

// worker
function* handleDetailSaga({ payload: { id } }) {
  try {
    const retryCount = 3;
    const retryDelay = 1 * 1000; // ms
    const data = yield retry(retryCount, retryDelay, addDetailsRequest, id);
    yield put(addDetailsSuccess(data));
  } catch (e) {
    yield put(addDetailsFailure(e.message));
  }
}

// watcher
function* watchGetDetail() {
  yield takeLatest(DETAILS_REQUEST, handleDetailSaga);
}

export default function* saga() {
  yield spawn(watchGetList);
  yield spawn(watchGetDetail);
}
