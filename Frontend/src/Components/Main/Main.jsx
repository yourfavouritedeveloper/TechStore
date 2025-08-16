import styles from "./Main.module.css"
import axios from 'axios';
import React, { useEffect, useRef, useState,useContext  } from "react";
import { motion, useInView, useAnimation,AnimatePresence  } from "framer-motion";
import { applyFilters } from '../Utils/filterUtil';
import { Link,useNavigate,useLocation  } from "react-router-dom";
import Filter from "../Filter/Filter";
import BrandLogo from "../../../public/brandblack.png"



function Main() {
const circleRef1 = useRef(null);
  const circleRef2 = useRef(null);
  const boxRef = useRef(null);
  const lineRef = useRef(null);

  const circleInView1 = useInView(circleRef1, { once: true });
  const circleInView2 = useInView(circleRef2, { once: true });
  const boxInView = useInView(boxRef, { once: true });
  const lineInView = useInView(lineRef, { once: true })

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const boxControls = useAnimation();
  const lineControls = useAnimation();

  const navigate = useNavigate();
 const [searchTerm, setSearchTerm] = useState("");
  

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
    if (lineInView) lineControls.start("visible");
  }, [lineInView]);


    return ( <>
                  <div className={styles.type}>
                  <div className={styles.typebox}>
                    <motion.div className={styles.line}
                    ref={lineRef}
                    animate={lineControls}
                    variants={{
                    hidden: { 
                      y: 200
                    },
                    visible: { 
                      y:0
                    }
                    }}
                    initial="hidden"

                     viewport={{ margin: "10px" }}
                    transition={{
                    duration: 0.25,delay:0.5
                    }}    
                    
                    ></motion.div>  
                  </div>
                  
                <motion.div 
                  className={styles.circle1}
                   ref={circleRef1}
                    animate={controls1}
                   variants={{
                    hidden: {x: "-800px"},
                    visible: {x: "0px"}
                    }}
                    initial="hidden"
                    viewport={{ margin: "0px" }}
                    transition={{ duration: 1.25,delay:0.5}}
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
                    viewport={{ margin: "0px" }}
                    transition={{ duration: 1.25,delay:0.5}}
                    >
                    </motion.div>
                  <p className={styles.choose}>Choose Your Way to Shop</p>
                  <motion.div className={styles.storePicks}
                    ref={boxRef}
                    animate={boxControls}
                    variants={{
                    hidden: { 
                      y: 100
                    },
                    visible: { 
                      y:0
                    }
                    }}
                    initial="hidden"

                     viewport={{ margin: "10px" }}
                    transition={{
                    duration: 0.5
                    }}                     
                  >
                    <p className={styles.titleStore}>Best Store Picks</p>
                    <p className={styles.titleStoreSUB}>• Curated Quality – Handpicked items vetted for performance, durability, and value.</p>
                    <p className={styles.titleStoreSUB}>• Saves Time – Skip the research and go straight to the best options.</p>
                    <p className={styles.titleStoreSUB}>• Trusted by Users – Backed by ratings, reviews, and real purchase data.</p>
                    <Link className={styles.storeShop} to="/product">Shop now</Link> 
                  </motion.div>
                  <motion.div className={styles.communityMarket}
                    ref={boxRef}
                    animate={boxControls}
                    variants={{
                    hidden: { 
                      y: 100
                    },
                    visible: { 
                      y:0
                    }
                    }}
                    initial="hidden"

                     viewport={{ margin: "10px" }}
                    transition={{
                    duration: 0.5
                    }}                  
                    >
                      <p className={styles.titleCommunity}>Community Market</p>
                       <p className={styles.titleCommunitySUB}>• Diverse Listings – A wide range of products from different sellers in one place.</p>
                          <p className={styles.titleCommunitySUB}>• Competitive Pricing – Sellers compete, giving you better deals and discounts.</p>
                          <p className={styles.titleCommunitySUB}>• Direct Seller Connection – Communicate directly with sellers for personalized offers and support.</p>
                          <Link className={styles.communityShop} to="/product">Shop now</Link> 

                  </motion.div>
                  </div>  
                    <div className={styles.brandnewdiv}>
                        <h2>Looking for something specific?</h2>
                        <p>Our smart search helps you find exactly what you need in seconds.</p>
                      <form
                        onSubmit={(e) => {
                        e.preventDefault();
                        navigate("/product", { state: { search: searchTerm, category: null } });
                        }}
                        >
                          <input
                            type="text"
                            placeholder="Try 'wireless headphones', 'gaming laptop'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            onKeyDown={(e) => {
                               if (e.key === "Enter") {
                                 e.preventDefault(); 
                                 console.log(searchTerm);
                                  navigate("/product", { state: { search: searchTerm, category: null } }); 
                                }
                           }}
                          />
                       <button type="submit" className={styles.search}>Start Searching</button>
                      </form>
                        <img src={BrandLogo} alt="" />

                    </div>
    
    
    </>)
}






export default Main;