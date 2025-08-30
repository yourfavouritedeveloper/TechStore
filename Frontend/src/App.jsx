import { useState } from "react";
import { HashRouter,Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Items from "./Pages/Items";
import Item from "./Pages/Item"
import Login from "./Pages/Login";
import { AuthProvider } from "./Components/AuthContext";
import Register from "./Pages/Register";

function App() {
    const [shiftUp, setShiftUp] = useState(false);
  return (
    <>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home  shiftUp={shiftUp} setShiftUp={setShiftUp}/>} />
          <Route path="/product" element={<Items shiftUp={shiftUp} setShiftUp={setShiftUp}/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login shiftUp={shiftUp} setShiftUp={setShiftUp}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id"   element={<Item shiftUp={shiftUp} setShiftUp={setShiftUp} />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
    </>
  );
}

export default App;
