import { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Campaign from "./Pages/Campaign";
import Items from "./Pages/Items";
import Item from "./Pages/Item"
import Login from "./Pages/Login";
import { AuthProvider } from "./Components/AuthContext";
import Register from "./Pages/Register";
import Account from "./Pages/Account";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import Cart from "./Pages/Cart"
import Success from "./Pages/Success";
import { PurchaseProvider } from "./Components/Utils/PurchaseContext";
import Password from "./Pages/Password";

function App() {
  const [shiftUp, setShiftUp] = useState(false);
  return (
    <>
      <AuthProvider>
        <PurchaseProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home shiftUp={shiftUp} setShiftUp={setShiftUp} />} />
              <Route path="/product" element={<Items shiftUp={shiftUp} setShiftUp={setShiftUp} />} />
              <Route path="/campaign" element={<Campaign />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<Item shiftUp={shiftUp} setShiftUp={setShiftUp} />} />
              <Route path="/account/:username" element={<Account />} />
              <Route path="/account/:username/product/add" element={<AddProduct />} />
              <Route path="/account/:username/product/edit/:id" element={<EditProduct />} />
              <Route path="/account/:username/cart" element={<Cart />} />
              <Route path="/success" element={<Success />} />
              <Route path="/recover" element={<Password />} />
            </Routes>
          </HashRouter>
        </PurchaseProvider>
      </AuthProvider>
    </>
  );
}

export default App;
