import { useState, useEffect, useRef } from "react";
import Nav from "../Components/Nav/Nav";
import Background from "../Components/Background/Background";
import Body from "../Components/Body/Body";
import Item from "../Components/Items/Item";
import Footer from "../Components/Footer/Footer";
import axios from 'axios';

function Home() {
  const shopRef = useRef(null);
  const itemRef = useRef(null);
  const [navHighlight, setNavHighlight] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const [bodyItems, setBodyItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

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
      const y = shopRef.current.getBoundingClientRect().top + window.scrollY + 120;
      window.scrollTo({ top: y, behavior: "smooth" });    }
  }

    function scrollToItems() {
    if (itemRef.current) {
      const y = itemRef.current.getBoundingClientRect().top + window.scrollY + 230;
      window.scrollTo({ top: y, behavior: "smooth" });    }
  }


  useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/all")
      .then(res => {
        setAllItems(res.data);
        setFilteredItems(res.data); 
      })
      .catch(err => console.error(err));
  }, []);

  function handleCategoryFilter(category) {
    if (category === "All") {
      setBodyItems(allItems);
    } else {
      const filtered = allItems.filter(item =>
        item.category && item.category.toLowerCase() === category.toLowerCase()
      );
      setBodyItems(filtered);
    }
    scrollToItems(); 
  }

  function handleResetFilters() {
    setFilteredItems(allItems);
  }

  return (
    <>
      <Nav highlight={navHighlight} />
      <Background shopRef={shopRef} scrollTo={scrollToShop} />
      <Body shopRef={shopRef} itemRef={itemRef} scrollTo={scrollToItems} onCategorySelect={handleCategoryFilter} />
      <Item items={filteredItems} bodyItems={bodyItems} itemRef={itemRef}   onResetFilters={handleResetFilters}  />
      <Footer />
    </>
  );
}

export default Home;