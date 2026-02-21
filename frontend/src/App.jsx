import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Player from "./pages/Player";
export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/player/:id" element={<Player/>}/>
      </Routes>
    </BrowserRouter>
  );
}