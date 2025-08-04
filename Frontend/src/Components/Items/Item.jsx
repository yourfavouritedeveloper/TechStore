import styles from "./Item.module.css"
import axios from 'axios';
import { useState, useEffect } from "react";
import { applyFilters } from '../Utils/filterUtil';
import Filter from "../Filter/Filter";
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


                  <div className={styles.populardiv}>
                    <p className={styles.popular}>Most Popular</p>
                    <ul className={styles.itemsPopular}>
                      {itemsPopular.map((item) => (
                        <li key={item.id} className={styles.item} style={{backgroundColor:"rgb(245, 245, 245)"}}>
                          <p className={styles.searchRate}><b>Searched {item.searched} times</b></p>
                          <img  src={item.productImageUrl} alt={item.name} style={{ width: 300 }} />
                          <h3>{item.name}</h3>
                          <p className={styles.guarantee}>{item.guarantee} month</p>
                          <span><b>₼{item.price}</b></span>
                      </li>
                      ))}
                    </ul>
                    </div>
                    
                    <div className={styles.sellerdiv}>
                      <p className={styles.sellers}>Most Sellers</p>
                      <ul className={styles.itemsBought}>
                        {itemsSeller.map((item) => (
                        <li key={item.id} className={styles.item}>
                            <p className={styles.boughtRate}><b>Bought {item.bought} times</b></p>
                            <img  src={item.productImageUrl} alt={item.name} style={{ width: 300 }} />
                            <h3>{item.name}</h3>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <span><b>₼{item.price}</b></span>
                        </li>
                        ))}                
                      </ul>
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