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
import spinner from "../../../public/brandlogo.png"


function Item({ items, itemRef,bodyItems,  onResetFilters  }) {

  const [isHovered, setIsHovered] = useState(false);
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
            <div className={styles.container} ref={itemRef}>
              <Link className={styles.discoverBox} to="/product">
                  <p className={styles.title}>Discover</p>
                  <p className={styles.subtitle}>The newest, most valued products and stay ahead of trends.</p>
                  <img src={Apple} alt="" />
              </Link>
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
              {itemsPopular && itemsPopular.length > 0 && itemsSeller && itemsSeller.length > 0 ? (
                <>
                  <div className={styles.populardiv}>
                    <ul className={styles.itemsPopular}>
                      {itemsPopular.map((item) => (
                        <Link key={item.id} className={styles.item} to={"/product/" + item.id}>
                          <p className={styles.searchRate}>Searched {item.searched ?? 0} times</p>
                          <div className={styles.popularInfo}>
                            <img src={item.productImageUrl} alt={item.name} />
                          </div>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guaranteeTitle}>Guarantee</p>
                            <p className={styles.guarantee}>{item.guarantee ?? 0} month</p>
                            <p className={styles.availTitle}>Available</p>
                            <p className={styles.avail}>{item.amount}</p>
                            <p className={styles.priceTitle}>Price</p>
                            <p className={styles.price}>{item.price ?? 0}₼</p>
                            <button className={styles.cart}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>
                              <p className={styles.cartText} style={{opacity: isHovered ? "1" : "0"}}>Add to Cart</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                                </svg>
                            </button>
                        </Link>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.sellerdiv}>
                    <ul className={styles.itemsBought}>
                      {itemsSeller.map((item) => (
                        <Link key={item.id} className={styles.item} to={"/product/" + item.id}>
                          <p className={styles.boughtRate}>Bought {item.bought ?? 0} times</p>
                          <div className={styles.popularInfo}>
                            <img src={item.productImageUrl} alt={item.name} />
                          </div>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guaranteeTitle}>Guarantee</p>
                            <p className={styles.guarantee}>{item.guarantee ?? 0} month</p>
                            <p className={styles.availTitle}>Available</p>
                            <p className={styles.avail}>{item.amount}</p>
                            <p className={styles.priceTitle}>Price</p>
                            <p className={styles.price}>{item.price ?? 0}₼</p>
                            <button className={styles.cart}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}>
                              <p className={styles.cartText} style={{opacity: isHovered ? "1" : "0"}}>Add to Cart</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                                </svg>
                            </button>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className={styles.loadingContainer}>
                  <img src={spinner} alt="Loading..." className={styles.loadingImage} />
                </div>
              )}

                   

                </div>
          
        </>

    );
}

export default Item;