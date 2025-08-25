import styles from "./Item.module.css"
import axios from 'axios';
import React, { useEffect, useRef, useState,useContext  } from "react";
import { motion, useInView, useAnimation,AnimatePresence  } from "framer-motion";
import { applyFilters } from '../Utils/filterUtil';
import { Link,useNavigate,useLocation  } from "react-router-dom";
import Filter from "../Filter/Filter";
import BrandLogo from "../../../public/brandblack.png"



function Item({ items, itemRef,bodyItems,  onResetFilters  }) {


  const [itemsPopular, setItemsPopular] = useState([]);
  const [itemsSeller, setItemsSeller] = useState([]);



    useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/popular") 
      .then(response => {
        setItemsPopular(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

    useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/bought") 
      .then(response => {
        setItemsSeller(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  



    return(
        <>
            <div className={styles.container}>
                  <p className={styles.title}>Discover</p>
                <div className={styles.container1}>
                  <div className={styles.popularExplanation}>
                    <p className={styles.subtitle}>Most Popular Products</p>
                    <p className={styles.subsubtitle}>Discover our top-selling items that customers love the most! From trending gadgets to must-have accessories, explore the products that everyone is talking about. Stay ahead of the trend and find your favorites today.</p>
                    <Link className={styles.popularButton} to="/product">Shop Now</Link>
                  </div>
                  <div className={styles.populardiv}>
                    <ul className={styles.itemsPopular}>
                      {itemsPopular.map((item) => (
                        <Link key={item.name} className={styles.item} 
                        to= {"/product/" + item.name}
                        style={{backgroundColor:"rgb(245, 245, 245)"}}>
                          <p className={styles.searchRate}>Searched {item.searched} times</p>
                          <img  src={item.productImageUrl} alt={item.name} />
                          <p className={styles.name}>{item.name}</p>
                          <p className={styles.guarantee}>{item.guarantee} month</p>
                          <span>₼{item.price}</span>
                      </Link>
                      ))}
                    </ul>
                    </div>
                </div>
                <div className={styles.container2}>
                  <div className={styles.sellerExplanation}>
                    <p className={styles.subtitle}>Best Sellers</p>
                    <p className={styles.subsubtitle}>Explore our most-purchased products that have won the trust of thousands of customers. From premium quality items to unbeatable deals, these are the choices people can’t stop buying. Get yours before they’re gone!</p>
                    <Link className={styles.sellerButton} to="/product">Shop Now</Link>
                  </div>
                    <div className={styles.sellerdiv}>
                      <ul className={styles.itemsBought}>
                        {itemsSeller.map((item) => (
                        <Link key={item.name} className={styles.item}
                          to= {"/product/" + item.name}
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

                </div>
          
        </>

    );
}

export default Item;