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
              <div className={styles.cover}></div>
                <div className={styles.bar}>
                    <button className={styles.filter}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        height="21px" 
                        viewBox="0 -960 960 960" 
                        width="21px" 
                        fill="#000000ff">
                        <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>
                        </svg>
                        Filter
                    </button>
                    <form className={styles.input}>
                      <div className={styles.inputBar}>
                      <input type="text" placeholder="Enter the product name"/>
                      <svg className={styles.search}
                        xmlns="http://www.w3.org/2000/svg" 
                        height="34px" 
                        viewBox="0 -960 960 960"
                        width="34px" 
                        fill="#757575ff">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                      </div>
                      <label className={styles.low}>
                        <input type="radio" name="price" />
                        <span className={styles.lowSpan}>Low to High</span>
                      </label>

                      <label className={styles.high}>
                        <input type="radio" name="price" />
                        <span className={styles.highSpan}>High to Low</span>
                      </label>

                      <label className={styles.newest}>
                        <input type="radio" name="date" />
                        <span className={styles.newestSpan}>Newest</span>
                      </label>

                      <label className={styles.oldest}>
                        <input type="radio" name="date" />
                        <span className={styles.oldestSpan}>Oldest</span>
                      </label>

                      <button type="reset" className={styles.refresh}>Reset</button>
                    </form>
                   </div>
                    <label className={styles.more}>
                      <input type="checkbox" name="more" />
                      <span className={styles.moreSpan}>More</span>
                      <svg xmlns="http://www.w3.org/2000/svg"
                         height="28px" 
                         viewBox="0 -960 960 960" 
                         width="28px"
                          fill="#ffffffff">
                      <path d="M400-280v-400l200 200-200 200Z"/></svg>
                      <div className={styles.moreOption}></div>
                    </label>
                    <p className={styles.popular}>Most Popular</p>
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