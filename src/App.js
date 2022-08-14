import "./App.css";
import Main from "./components/Main";
import Details from "./components/Details";
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Main />}/>
        <Route path="/:id/details" element={<Details />}/>
      </Routes>
    </div>
  );
}

export default App;
