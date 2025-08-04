
import { HashRouter,Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Items from "./Pages/Items";


function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Items />}/>
          <Route path="/about" element={<About />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
