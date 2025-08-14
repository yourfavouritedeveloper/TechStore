import styles from "./Item.module.css"
import axios from 'axios';
import React, { useEffect, useRef, useState,useContext  } from "react";
import { motion, useInView, useAnimation,AnimatePresence  } from "framer-motion";
import { applyFilters } from '../Utils/filterUtil';
import { Link,useNavigate,useLocation  } from "react-router-dom";
import Filter from "../Filter/Filter";
function Item({ items, itemRef,bodyItems,  onResetFilters  }) {


  const [itemsPopular, setItemsPopular] = useState([]);
  const [itemsSeller, setItemsSeller] = useState([]);

  const circleRef1 = useRef(null);
  const circleRef2 = useRef(null);
  const boxRef = useRef(null);

  const circleInView1 = useInView(circleRef1, { once: true });
  const circleInView2 = useInView(circleRef2, { once: true });
  const boxInView = useInView(boxRef, { once: true });

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const boxControls = useAnimation();

  useEffect(() => {
   if (circleInView1) controls1.start("visible");
  }, [circleInView1]);
  useEffect(() => {
    if (circleInView2) controls2.start("visible");
  }, [circleInView2]);
  useEffect(() => {
    if (boxInView) boxControls.start("visible");
  }, [boxInView]);

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
                    <Link className={styles.popularButton}>Shop Now</Link>
                  </div>
                  <div className={styles.populardiv}>
                    <ul className={styles.itemsPopular}>
                      {itemsPopular.map((item) => (
                        <li key={item.id} className={styles.item} style={{backgroundColor:"rgb(245, 245, 245)"}}>
                          <p className={styles.searchRate}><b>Searched {item.searched} times</b></p>
                          <img  src={item.productImageUrl} alt={item.name} style={{ width: 200 }} />
                          <h3>{item.name}</h3>
                          <p className={styles.guarantee}>{item.guarantee} month</p>
                          <span><b>₼{item.price}</b></span>
                      </li>
                      ))}
                    </ul>
                    </div>
                </div>
                <div className={styles.container2}>
                  <div className={styles.sellerExplanation}>
                    <p className={styles.subtitle}>Best Sellers</p>
                    <p className={styles.subsubtitle}>Explore our most-purchased products that have won the trust of thousands of customers. From premium quality items to unbeatable deals, these are the choices people can’t stop buying. Get yours before they’re gone!</p>
                    <Link className={styles.sellerButton}>Shop Now</Link>
                  </div>
                    <div className={styles.sellerdiv}>
                      <ul className={styles.itemsBought}>
                        {itemsSeller.map((item) => (
                        <li key={item.id} className={styles.item}>
                            <p className={styles.boughtRate}><b>Bought {item.bought} times</b></p>
                            <img  src={item.productImageUrl} alt={item.name} style={{ width: 200 }} />
                            <h3>{item.name}</h3>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <span><b>₼{item.price}</b></span>
                        </li>
                        ))}                
                      </ul>
                    </div>
                   
                </div>
                <div className={styles.type}>
                <motion.div 
                  className={styles.circle1}
                   ref={circleRef1}
                    animate={controls1}
                   variants={{
                    hidden: {x: "-800px"},
                    visible: {x: "0px"}
                    }}
                    initial="hidden"
                    viewport={{ margin: "10px" }}
                    transition={{ duration: 1.25}}
                    >
                      
                    </motion.div>

                    <motion.div 
                    className={styles.circle2}
                    ref={circleRef2}
                    animate={controls2}
                    variants={{
                    hidden: {x: "800px"},
                    visible: {x: "0px"}
                    }}
                    initial="hidden"
                    viewport={{ margin: "10px" }}
                    transition={{ duration: 1.25}}
                    >
                    </motion.div>
                  <p className={styles.choose}>Choose Your Way to Buy</p>
                  <motion.div className={styles.storePicks}
                    ref={boxRef}
                    animate={boxControls}
                    variants={{
                    hidden: { 
                      y: 300
                    },
                    visible: { 
                      y:0
                    }
                    }}
                    initial="hidden"

                     viewport={{ margin: "10px" }}
                    transition={{
                    duration: 1
                    }}                     
                  >
                    <p className={styles.titleStore}>Best Store Picks</p>
                  </motion.div>
                  <motion.div className={styles.communityMarket}
                    ref={boxRef}
                    animate={boxControls}
                    variants={{
                    hidden: { 
                      y: 300
                    },
                    visible: { 
                      y:0
                    }
                    }}
                    initial="hidden"

                     viewport={{ margin: "10px" }}
                    transition={{
                    duration: 1
                    }}                  
                    >
                      <p className={styles.titleCommunity}>Community Market</p>
                  </motion.div>
                </div>
              <div className={styles.brandnewdiv}>
                      <h2>Looking for something specific?</h2>
                      <p>Our smart search helps you find exactly what you need in seconds.</p>
                      <input type="text" placeholder="Try 'wireless headphones', 'gaming laptop'..." />
                      <button>Start Searching</button>
              </div>
            </div>
        </>

    );
}

export default Item;