
import { HashRouter,Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Items from "./Pages/Items";
import Login from "./Pages/Login";
import { AuthProvider } from "./Components/AuthContext";
import Register from "./Pages/Register";

function App() {
  return (
    <>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Items />}/>
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
    </>
  );
}

export default App;
