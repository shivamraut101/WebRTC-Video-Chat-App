import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom"
import Lobby from './screens/Lobby';
function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Lobby/>} />
      </Routes>
    </>
  );
}

export default App;
