import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { applyFilters } from '../Components/Utils/filterUtil';
import Filter from '../Components/Filter/Filter';
import Nav from "../Components/Nav/Nav"
import Product from "../Components/Product/Product"
import Footer from "../Components/Footer/Footer"
import CampaignAdd from '../Components/CampaignAdd/CampaignAdd';

function Items({ shiftUp, setShiftUp }) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shopRef = useRef(null);
  const itemRef = useRef(null);
  const [navHighlight, setNavHighlight] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const [bodyItems, setBodyItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);



  useEffect(() => {
    function onScroll() {
      if (!shopRef.current) return;

      const shopTop = shopRef.current.getBoundingClientRect().top + 200;
    
      if (shopTop <= 20) {
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
      const y = shopRef.current.getBoundingClientRect().top + window.scrollY + 230;
      window.scrollTo({ top: y, behavior: "smooth" });    }
  }

    function scrollToItems() {
    if (itemRef.current) {
      const y = itemRef.current.getBoundingClientRect().top + window.scrollY + 230;
      window.scrollTo({ top: y, behavior: "smooth" });    }
  }

    useEffect(() => {
    function onScroll() {
      if (!shopRef.current) return;

      const shopTop = shopRef.current.getBoundingClientRect().top + 200;
    
      if (shopTop <= 20) {
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


    return (<>
            <title>TechStore | Products </title>
            <Nav highlight={navHighlight} shiftUp={shiftUp} setShiftUp={setShiftUp}/>
            <Product shopRef={shopRef}/>
            <Filter items={filteredItems} bodyItems={bodyItems} itemRef={itemRef}   onResetFilters={handleResetFilters} />
            <CampaignAdd />
            <Footer />
    

    
    </>);
}

export default Items;