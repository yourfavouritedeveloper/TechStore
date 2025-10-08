import styles from "./Body.module.css"
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Iphone from "../../assets/iphone.png";
import Macbook from "../../assets/macbook.png";
import TV from "../../assets/tv.png";
import Watch from "../../assets/watch.png";
import Keyboard from "../../assets/keyboard.png";
import Headphone from "../../assets/headphone.png";
import Monitor from "../../assets/monitor.png";
import Tablet from "../../assets/tablet.png";
import Item from "../Items/Item";
import { applyFilters } from '../Utils/filterUtil';

function Body({itemRef,scrollTo, onItemClick,onCategorySelect}) {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/all")
      .then(res => {
        setAllItems(res.data);
        setFilteredItems(res.data);
      });
  }, []);

  const navigate = useNavigate(null);

  function handleClick(category) {
    scrollTo?.();
    onItemClick?.();
    navigate("/product", { state: { category } })
    onCategorySelect?.(category);
  }


    return(
        <>
            <div className={styles.container}  ref={itemRef}>
                <p className={styles.title}>Categories</p>
                <ul className={styles.categories}>


                    <li ref={itemRef} className={styles.computers}  onClick={() => handleClick("COMPUTER")}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                        
                        <p>Computers</p>
                        <img src={Macbook} alt="Computers" />
                        </li>



                    <li ref={itemRef} onClick={() => handleClick("MOBILE_PHONE")}className={styles.mobilePhones} >
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                            
                        <p>Phones</p>
                        <img src={Iphone} alt="Phones" />
                    </li>



                    <li ref={itemRef} onClick={() => handleClick("TV")} className={styles.tvs}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span> 
                        <p>TVs</p>
                        <img src={TV} alt="tvs" />
                        
                    </li>



                    <li ref={itemRef} onClick={() => handleClick("SMART_WATCH")} className={styles.smartWatches}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span> 
                        <p>Watches</p>
                        <img src={Watch} alt="watches" />
                        </li>




                    <li ref={itemRef} onClick={() => handleClick("KEYBOARD")} className={styles.keyboards}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span> 
                        <p>Keyboards</p>
                        <img src={Keyboard} alt="keyboards" />
                    </li>



                    <li ref={itemRef} onClick={() => handleClick("HEADPHONE")} className={styles.headphones}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                         
                        <p>Headphones</p>
                        <img src={Headphone} alt="headphones" />                        
                        </li>



                    <li ref={itemRef} onClick={() => handleClick("MONITOR")} className={styles.monitors}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>    
                        <p>Monitors</p>
                        <img src={Monitor} alt="monitors" />                        
                        </li>



                    <li ref={itemRef} onClick={() => handleClick("TABLET")} className={styles.tablets}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                         
                        <p>Tablets</p>
                        <img src={Tablet} alt="tablets" />                           
                    </li>
                </ul>
            </div>
        </>

    );
}


export default Body;