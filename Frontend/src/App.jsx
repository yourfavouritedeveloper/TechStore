import { useState, useEffect, useRef } from "react";
import Nav from "./Nav/Nav";
import Background from "./Background/Background";
import Body from "./Body/Body";
import Item from "./Items/Item";

function App() {
  const shopRef = useRef(null);
  const [navHighlight, setNavHighlight] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function onScroll() {
      if (!shopRef.current) return;

      const shopTop = shopRef.current.getBoundingClientRect().top;
    
      if (shopTop <= 50) {
        setNavHighlight(true);
      } else {
        setNavHighlight(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function scrollToShop() {
    if (shopRef.current) {
      const y = shopRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  }

  return (
    <>
      <Nav highlight={navHighlight} />
      <Background shopRef={shopRef} scrollTo={scrollToShop} />
      <Body shopRef={shopRef} />
      <Item></Item>
    </>
  );
}

export default App;
