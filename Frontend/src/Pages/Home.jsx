import { useState, useEffect, useRef } from "react";
import Nav from "../Components/Nav/Nav";
import Background from "../Components/Background/Background";
import Body from "../Components/Body/Body";
import Item from "../Components/Items/Item";
import Main from "../Components/Main/Main"
import Footer from "../Components/Footer/Footer";
import AdBanner from "../Components/Utils/AdBanner"
import axios from 'axios';
import Category from "../Components/Category/Category";

function Home({ shiftUp, setShiftUp }) {
  const shopRef = useRef(null);
  const itemRef = useRef(null);
  const highRef = useRef(null);
  const brandRef = useRef(null);
  const backgroundRef = useRef(null);
  const [navHighlight, setNavHighlight] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const [bodyItems, setBodyItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    window.onbeforeunload = () => window.scrollTo(0, 0);
  }, []);

useEffect(() => {
  function handleScroll() {
    const backgroundRect = backgroundRef.current?.getBoundingClientRect();
    const itemRect = itemRef.current?.getBoundingClientRect();
    const highRect = highRef.current?.getBoundingClientRect();
    const brandRect = brandRef.current?.getBoundingClientRect();

    if (backgroundRect && backgroundRect.bottom > 200) {
      setNavHighlight(false);
    } else if (itemRect && itemRect.top < window.innerHeight && itemRect.bottom >0) {
      setNavHighlight(true);
    } else if (highRect && highRect.top < window.innerHeight && highRect.bottom > 0) {
      setNavHighlight(false);
    } else if (brandRect && brandRect.top < window.innerHeight && brandRect.bottom > 0) {
      setNavHighlight(false);
     } else {
      setNavHighlight(true);
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); 

  return () => window.removeEventListener("scroll", handleScroll);
}, [backgroundRef, itemRef, highRef]);



function scrollToShop() {
  if (shopRef.current) {
    let offset;

    if (window.innerWidth <= 768) {
      offset = (window.innerHeight * 0.43) + (1000 / window.innerWidth) * 5 + window.innerWidth * 0.05;
    } else {
      offset = (window.innerHeight * 0.17) + (1500 / window.innerWidth) * 5 + window.innerWidth * 0.01;
    }

    const y = shopRef.current.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
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
    <> <title>TechStore</title>
      <Nav highlight={navHighlight} shiftUp={shiftUp} setShiftUp={setShiftUp}/>
      <Background backgroundRef={backgroundRef} shopRef={shopRef} scrollTo={scrollToShop} onCategorySelect={handleCategoryFilter} />
      <Item items={filteredItems} bodyItems={bodyItems} itemRef={itemRef}   onResetFilters={handleResetFilters}  />
      <Category shopRef={shopRef} itemRef={itemRef} scrollTo={scrollToItems} onCategorySelect={handleCategoryFilter} />
      <Main highRef={highRef} brandRef={brandRef} />
      <Footer />
    </>
  );
}

export default Home;