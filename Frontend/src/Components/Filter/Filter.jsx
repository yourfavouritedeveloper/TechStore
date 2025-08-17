import styles from "./Filter.module.css"
import axios from 'axios';
import { useState, useEffect,useRef } from "react";
import { applyFilters } from '../Utils/filterUtil';
import { useLocation } from "react-router-dom";

function Filter({ items, itemRef,bodyItems,  onResetFilters  }) {

  const scrollRef = useRef(null);
  const location = useLocation();
  const category = location.state?.category;
  const search = location.state?.search || "";
  const [name, setName] = useState("");
  const [originalItems, setOriginalItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortOptions, setSortOptions] = useState({
    price: null,
    date: null,
  });
  const [resetClicked, setResetClicked] = useState(false);

useEffect(() => {
  setName(search);
}, [search]);




useEffect(() => {
  if(!name) {
    setOriginalItems(items);
    setFilteredItems(items);
      setResetClicked(true);  
      return; 
  }

  const query = (name || "").trim().toLowerCase();

  console.log("Search query:", query);
  console.log("Original items:", items);

  const filtered = query
    ? (items || []).filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    : (items || []);
    

    
  console.log("Filtered items:", filtered);

  setOriginalItems(filtered);
  setFilteredItems(filtered);
  setResetClicked(false);   


  if (query)   window.scrollTo({ top: 500, behavior: "smooth" });

}, [items, name]);



useEffect(() => {
  if (category) {
      const filtered = items.filter(item => item.category === category);
    setOriginalItems(filtered);
    setFilteredItems(filtered);
    setResetClicked(false);
    window.scrollTo({ top: 500, behavior: "smooth" });


  } 

}, [category, items]);


const handleFilterClick = () => {
  const filtered = applyFilters(filteredItems, sortOptions);
  setFilteredItems(filtered);
  setResetClicked(false);
  window.scrollTo({ top: 500, behavior: "smooth" });
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
        <div className={styles.container} style={displayItems.length === 0 || resetClicked ?{ marginBottom: "26rem"} : {marginBottom: "0rem"}}>
        <div className={styles.cover}>

          <div className={styles.subtitle}>From phones to TVs discover it all
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>

          </div>
        </div>
                <div className={styles.bar}>
                  <div className={styles.inBar}></div>
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
                    
                    <form ref={scrollRef}  className={styles.input}>
                      <div className={styles.inputBar}>
                      <input type="text" placeholder="Enter the product name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); 
                          setResetClicked(false);
                          window.scrollTo({ top: 720, behavior: "smooth" });


                        }
                        }}
                      />
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
                    <label className={styles.more}>
                      <input type="checkbox" name="more" />
                      <span className={styles.moreSpan}>More</span>
                      <svg xmlns="http://www.w3.org/2000/svg"
                         height="28px" 
                         viewBox="0 -960 960 960" 
                         width="28px"
                          fill="#ffffffff">
                      <path d="M400-280v-400l200 200-200 200Z"/></svg>




                      <div className={styles.moreOption}>
                        <div className={styles.bestSelling}>
                          <input
                            type="radio"
                            id="bestSelling"
                            name="sortOption"
                            onChange={() => handleSortChange("bestSelling", "highToLow")}
                          />
                          <label htmlFor="bestSelling">Best Selling</label>
                        </div>

                        <div className={styles.mostSearched}>
                          <input
                            type="radio"
                            id="ratingLow"
                            name="sortOption"
                            onChange={() => handleSortChange("rating", "lowToHigh")}
                          />
                          <label htmlFor="ratingLow">Rating: Low to High</label>
                        </div>

                            <button type="button" onClick={handleFilterClick}>
                              Apply
                            </button>
                      </div>

                    </label>
                    </form>
                    
                   </div>


                    <div className={styles.itemContainer} style={displayItems.length === 0 || resetClicked ?{ display:"none"} : {}}>
                      <ul className={styles.items}>
                        {displayItems.map((item) => (
                          <li key={item.name} className={styles.item} style={{ backgroundColor: "rgb(245, 245, 245)" }}>
                            <img src={item.productImageUrl} alt={item.name} style={{ width: 270 }} />
                            <h3>{item.name}</h3>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <span><b>₼{item.price}</b></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
        </>
    );
}


export default Filter;