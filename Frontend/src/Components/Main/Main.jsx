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

  const popularProducts = [
  { name: "iPhone 15 Pro Max", id: 1 },
  { name: "MacBook Pro", id: 7 },
  { name: "Samsung Galaxy S24 Ultra", id: 2 },
  { name: "Dell XPS 15", id: 14 },
  ];

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
            <div className={styles.aiDiv}  ref={highRef}>
                  <img className={styles.background} ref={highRef} src={Background} alt="" />
                  <div className={styles.particleWrapper}>
                    <ParticleSphere />
                  </div>
                  <div className={styles.type}>
                  <div className={styles.typebox}>
                    
                  </div>


                  <div className={styles.storePicks}
                   
                  >
                    <p className={styles.titleStore1}>The Best Picks</p>
                    <p className={styles.titleStore2}>of Store</p>
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

                <div className={styles.glassBand}>
                  <p>Your Journey Starts Here!</p>
                </div>

                <div className={styles.brandnewdiv} ref={brandRef}>
                  <div className={styles.searchHeader}>
                    <p className={styles.title}>Looking for something specific?</p>
                    <p className={styles.subtitle}>Our smart search helps you find exactly what you need in seconds.</p>
                  </div>

                  <div className={styles.searchCard}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (searchTerm.trim()) {
                          navigate("/product", { state: { search: searchTerm, category: null } });
                        }
                      }}
                    >
                      <div className={styles.searchRow}>
                        <div className={styles.searchInputWrapper}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.searchIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <input
                            type="text"
                            maxLength={50}
                            placeholder="Try 'Iphone 15', 'Macbook Pro', 'Samsung Galaxy'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                navigate("/product", { state: { search: searchTerm, category: null } });
                              }
                            }}
                            className={styles.searchInput}
                          />
                        </div>
                        <button type="submit" className={styles.searchButton}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.searchButtonIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <span>Start Searching</span>
                        </button>
                      </div>
                    </form>

                    <div className={styles.popularSearches}>
                      <p className={styles.popularTitle}>Popular:</p>
                      {popularProducts.map(({ name, id }) => (
                        <button
                          key={id}
                          className={styles.popularButton}
                          onClick={() => {
                            setSearchTerm(name);
                            navigate(`/product/${id}`);
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>

                    <div className={styles.circleGlow1}></div>
                    <div className={styles.circleGlow2}></div>
                  </div>
                </div>
    
    
    </>)
}






export default Main;