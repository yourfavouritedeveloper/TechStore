import styles from "./Main.module.css"
import axios from 'axios';
import React, { useEffect, useRef, useState,useContext  } from "react";
import { motion, useInView, useAnimation,AnimatePresence  } from "framer-motion";
import { applyFilters } from '../Utils/filterUtil';
import { Link,useNavigate,useLocation  } from "react-router-dom";
import Filter from "../Filter/Filter";
import BrandLogo from "../../../public/brandblack.png";
import ParticleSphere from "../Model/ParticleSphere"
import Background from "../../assets/black.jpg"

function Main({highRef,brandRef}) {
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
            <div ref={highRef} className={styles.aiDiv}>
                  <img className={styles.background} src={Background} alt="" />
                  <div className={styles.particleWrapper}>
                    <ParticleSphere />
                  </div>
                  <div className={styles.type}>
                  <div className={styles.typebox}>
                    
                  </div>

                  
                  
                  
                <div 
                  className={styles.circle1}
                   ref={circleRef1}
                    >
                      
                    </div>

                    <div 
                    className={styles.circle2}
                    >
                    </div>
                  <div className={styles.storePicks}
                   
                  >
                    <p className={styles.titleStore}>The Best Picks of Store</p>
                    <p className={styles.titleStoreSUB}>Curated recommendations from your favorite stores, so you can shop smarter and discover top-rated items.</p>
                    <button className={styles.storeShop} to="/product">Shop now</button> 
                  </div>

                  </div>  

                  <div className={styles.explanationDiv} >
                    <p className={styles.leftText}>Suggests the best local store for a product, considering price, availability, and promotions</p>
                    <p className={styles.middleText}>Offers products based on user-preferred features, such as battery life, camera, brand, or price</p>
                    <p className={styles.rightText}>Creates and adjusts personalized bundles from user preferences and browsing history</p>
                  </div>
                    <p className={styles.explanationTitle}>Get smart suggestions, explore items that match what you want, and receive tailored recommendations</p>
                    <p className={styles.explanationSubtitle}>TechStore provides everything from store comparisons to personalized product suggestions — all made for your convenience.</p>
                    <Link className={styles.launch}>Launch App</Link>


              </div>
                    <div className={styles.brandnewdiv} ref={brandRef}>
                        <p className={styles.title}>Looking for something specific?</p>
                        <p className={styles.subtitle}>Our smart search helps you find exactly what you need in seconds.</p>
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
                      <div className={styles.circle3}></div>
                      <div className={styles.circle4}></div>

                    </div>
    
    
    </>)
}






export default Main;