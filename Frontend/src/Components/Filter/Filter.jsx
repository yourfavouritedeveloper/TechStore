import styles from "./Filter.module.css"
import axios from 'axios';
import { useState, useEffect } from "react";
import { applyFilters } from '../Utils/filterUtil';

function Filter({ items, itemRef,bodyItems,  onResetFilters  }) {


  const [originalItems, setOriginalItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortOptions, setSortOptions] = useState({
    price: null,
    date: null,
  });
  const [resetClicked, setResetClicked] = useState(false);




useEffect(() => {
  if (bodyItems && bodyItems.length > 0) {
    setOriginalItems(bodyItems);
    setFilteredItems(bodyItems);
    setResetClicked(false);

  } else {
    setOriginalItems(items);
    setFilteredItems(items);
   setResetClicked(true);   
  }

}, [bodyItems, items]);


const handleFilterClick = () => {
  const filtered = applyFilters(filteredItems, sortOptions);
  setFilteredItems(filtered);
  setResetClicked(false);
};


const handleReset = () => {
  
  setResetClicked(true);
  setFilteredItems(items);
  if (onResetFilters) onResetFilters();
};


  
const handleSortChange = (type, value) => {
  setSortOptions(prev => ({ ...prev, [type]: value }));
};

const displayItems = filteredItems.length ? filteredItems : [];




    return (
        <>
                <div className={styles.bar}>
                    <button className={styles.filter}
                    onClick={handleFilterClick}>
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
                        <input type="radio" name="price" 
                        onChange={() => handleSortChange("price", "lowToHigh")}/>
                        <span className={styles.lowSpan}>Low to High</span>
                        
                      </label>

                      <label className={styles.high}>
                        <input type="radio" name="price" 
                          onChange={() => handleSortChange("price", "highToLow")}/>
                        <span className={styles.highSpan}>High to Low</span>
                      </label>

                      <label className={styles.newest}>
                        <input type="radio" name="date" 
                        onChange={() => handleSortChange("date", "newest")}/>
                        <span className={styles.newestSpan}>Newest</span>
                      </label>

                      <label className={styles.oldest}>
                        <input type="radio" name="date"
                        onChange={() => handleSortChange("date", "oldest")}/>
                        <span className={styles.oldestSpan}>Oldest</span>
                      </label>

                      <button type="reset" className={styles.refresh}
                        onClick={handleReset}>Reset</button>
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

                    <div className={styles.itemContainer} style={resetClicked ? { display:"none",opacity:0} : {}}>
                      <ul className={styles.items}>
                        {displayItems.map((item) => (
                          <li key={item.id} className={styles.item} style={{ backgroundColor: "rgb(245, 245, 245)" }}>
                            <img src={item.productImageUrl} alt={item.name} style={{ width: 270 }} />
                            <h3>{item.name}</h3>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <span><b>₼{item.price}</b></span>
                          </li>
                        ))}
                      </ul>
                    </div>
        </>
    );
}


export default Filter;