import { useState } from "react";
import { HashRouter,Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Items from "./Pages/Items";
import Item from "./Pages/Item"
import Login from "./Pages/Login";
import { AuthProvider } from "./Components/AuthContext";
import Register from "./Pages/Register";
import Account from "./Pages/Account";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import { PurchaseProvider } from "./Components/Utils/PurchaseContext";

function App() {
    const [shiftUp, setShiftUp] = useState(false);
  return (
    <>
    <AuthProvider>
      <PurchaseProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home  shiftUp={shiftUp} setShiftUp={setShiftUp}/>} />
          <Route path="/product" element={<Items shiftUp={shiftUp} setShiftUp={setShiftUp}/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login shiftUp={shiftUp} setShiftUp={setShiftUp}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id"   element={<Item shiftUp={shiftUp} setShiftUp={setShiftUp} />} />
          <Route path="/account/:username" element={<Account />} />
          <Route path="/account/:username/product/add" element={<AddProduct />} />
          <Route path="/account/:username/product/edit/:id" element={<EditProduct />} />
        </Routes>
      </HashRouter>
      </PurchaseProvider>
    </AuthProvider>
    </>
  );
}

export default App;
