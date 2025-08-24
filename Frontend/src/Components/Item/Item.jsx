import styles from "./Item.module.css"
import axios from "axios";
import { useState, useEffect } from "react";

function Item({name}) {

    const [item,setItem] = useState([])

    useEffect(() => {
    axios.get(`https://techstore-3fvk.onrender.com/api/v1/products/name/${name}`) 
      .then(response => {
        setItem(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

    const discount = item.discount ? item.price * (100-item.discount) / 100 : null;

    return(<>
    <div className={styles.container}>
        <div className={styles.item} 
            style={{ backgroundColor: "rgb(245, 245, 245)" }}>
            <img className={styles.image} src={item.productImageUrl} alt={item.name} />
        </div>
        <div className={styles.itemDescription}>
            <p className={styles.company}>{item.company}</p>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.guarantee}><u>Guarantee of {item.guarantee} month</u></p>
            <p className={discount ? styles.discounted : styles.price}>{item.price}₼</p>
            <p className={styles.rating}>Rating: {item.rating}/5.0</p>
            <div className={styles.ratingLine} style={{width:`${item.rating*2.8}rem`}}></div>
            <div className={styles.overallRating}></div>
            <button className={styles.check}>Check reviews</button>
            {discount && (
                <>
                <p className={styles.discount}>{item.discount}%</p>
                <div className={styles.line}></div>
                <p className={styles.discountedPrice}>{discount}₼</p>
                </>
            )
            }
            <button className={styles.buy}>Buy now</button>
            <button className={styles.cart}>Add to cart</button>
            <button className={styles.favourite}>Add to favourites</button>
        </div>
        <div className={styles.properties}>
        {item.properties &&  Object.entries(item.properties).map(([key, value]) => (
                <div key={key} className={styles.property}>
                <strong>{key}:</strong> {value}
                </div>
            ))}      

        </div>
    </div>

    
    </>);
}


export default Item;