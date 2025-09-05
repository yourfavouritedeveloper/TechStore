import styles from "./Item.module.css"
import axios from 'axios';
import React, { useEffect, useRef, useState,useContext  } from "react";
import { motion, useInView, useAnimation,AnimatePresence  } from "framer-motion";
import { applyFilters } from '../Utils/filterUtil';
import { Link,useNavigate,useLocation  } from "react-router-dom";
import Filter from "../Filter/Filter";
import BrandLogo from "../../../public/brandblack.png"
import Apple from "../../assets/apple.png"
import Keyboard from "../../assets/keykeyboard.png"
import TV from "../../assets/tvv.png"

function Item({ items, itemRef,bodyItems,  onResetFilters  }) {


  const [itemsPopular, setItemsPopular] = useState([]);
  const [itemsSeller, setItemsSeller] = useState([]);
  const [sortOptions, setSortOptions] = useState({
  price: null,
  date: null,
  bestSelling: null,
  searchRating: null,
  alphabetical: null,
  stock: null,
  rating: null,
  discount: null
});


    useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/popular") 
      .then(response => {
        setItemsPopular(response.data.slice(0, 5));
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

    useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/bought") 
      .then(response => {
        setItemsSeller(response.data.slice(0, 5));
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

const navigate = useNavigate();

const handleSortChange = (key, value) => {
  navigate("/product", { state: { sort: key, order: value } });
};
  



    return(
        <>
            <div className={styles.container}>
              <div className={styles.discoverBox}>
                  <p className={styles.title}>Discover</p>
                  <p className={styles.subtitle}>the newest, most valued products and stay ahead of trends.</p>
                  <img src={Apple} alt="" />
              </div>
              <div className={styles.containers}>
                <div className={styles.container1}>
                  <div className={styles.popularExplanation}>
                    <p className={styles.subtitle}>Most Popular Products</p>
                    <p className={styles.subsubtitle}>Discover top gadgets and accessories loved by all!</p>
                    <Link className={styles.popularButton} to="/product" onClick={() => handleSortChange("bestSelling", "highToLow")}>Shop Now</Link>
                  </div>
                    <img src={Keyboard} alt="" />
                  
                </div>

                <div className={styles.container2}>
                  <div className={styles.sellerExplanation}>
                    <p className={styles.subtitle}>Best Selling Products</p>
                    <p className={styles.subsubtitle}>Shop top picks, best deals, trusted by many!</p>
                    <Link className={styles.sellerButton} to="/product" state={{ sort: "bestSelling" }} >Shop Now</Link>
                  </div>
                    <img src={TV} alt="" />
                </div>

                
              </div>

                <div className={styles.populardiv}>
                    <ul className={styles.itemsPopular}>
                      {itemsPopular.map((item) => (
                        <Link key={item.id} className={styles.item} 
                        to= {"/product/" + item.id}
                       >
                          <p className={styles.searchRate}>Searched {item.searched} times</p>
                          <img  src={item.productImageUrl} alt={item.name} />
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.guarantee}>{item.guarantee} month</p>
                          <span>₼{item.price}</span>
                      </Link>
                      ))}
                    </ul>
                    </div>



                 <div className={styles.sellerdiv}>
                      <ul className={styles.itemsBought}>
                        {itemsSeller.map((item) => (
                        <Link key={item.id} className={styles.item}
                          to= {"/product/" + item.id}
                        >
                            <p className={styles.boughtRate}>Bought {item.bought} times</p>
                            <img  src={item.productImageUrl} alt={item.name}/>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <span>₼{item.price}</span>
                        </Link>
                        ))}                
                      </ul>
                    </div>
                   

                </div>
          
        </>

    );
}

export default Item;