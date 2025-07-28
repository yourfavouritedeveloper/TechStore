import styles from "./Item.module.css"
import axios from 'axios';
import { useState, useEffect } from "react";


function Item() {
  const [items, setItems] = useState([]);

    useEffect(() => {
    axios.get("http://localhost:8080/api/v1/products/all") 
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);



    return(
        <>
            <div className={styles.container}>
                <div className={styles.bar}>
                    <button className={styles.filter}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        height="21px" 
                        viewBox="0 -960 960 960" 
                        width="21px" 
                        fill="#ffffffff">
                        <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>
                        </svg>
                        Filter
                    </button>
                </div>
                <ul className={styles.items}>
                    {items.map((item) => (
                    <li key={item.id} className={styles.item}>
                        <h3>{item.name}</h3>
                        <p>{item.guarantee} month</p>
                        <span>₼{item.price}</span>
                    </li>
                    ))}
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>

            </div>
        </>

    );
}

export default Item;