import styles from "./Filter.module.css"
import axios from 'axios';
import { useState, useEffect,useRef, useContext } from "react";
import { applyFilters } from '../Utils/filterUtil';
import { useLocation, Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";


function Filter({ items, itemRef,bodyItems,  onResetFilters  }) {

  const [isAdding, setIsAdding] = useState(false);
  const [cart,setCart] = useState();
  const [cartItems, setCartItems] = useState([]);
  const {account, token,refreshToken,refreshAccessToken} = useContext(AuthContext);
  const [showCategories, setShowCategories] = useState(false);
  const [popularHoverId, setPopularHoverId] = useState(0);
  const [boughtHoverId, setBoughtHoverId] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverId, setHoverId] = useState(0);
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
  bestSelling: null,
  searchRating: null,
  alphabetical: null,
  stock: null,
  rating: null,
  discount: null
});

      const ensureAuthenticated = () => {       
        if (!refreshToken) {
          navigate("/login", { state: { from: location } });
          return false;
        }
        else if (!token) {
            refreshAccessToken();
            return true;
        }
        return true;
      
        };





  const [resetClicked, setResetClicked] = useState(false);

useEffect(() => {
  setName(search);
}, [search]);

     useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token || !account?.username) return;
                const accountResponse = await axios.get(
                    `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${account.username}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const logAccount = accountResponse.data;

                const cartResponse = await axios.get(
                    `https://techstore-3fvk.onrender.com/api/v1/carts/account/${logAccount.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setCart(cartResponse.data);
                const productIds = cartResponse.data.products
                  ? cartResponse.data.products.map(p => p.id)
                  : Object.keys(cartResponse.data.amounts || {}).map(id => parseInt(id));

                setCartItems(productIds);
            } catch (err) {
                console.error("Error fetching account or cart:", err);
            }
        };

        if (account?.username) {
            fetchData();
        }
    }, [account]);

const updateCart = async (item) => {
  if (!ensureAuthenticated()) return;
  if (!cart || !item) return;

  const currentAmount = cart.amounts?.[item.id] || 0;
  const isInCart = currentAmount > 0;

  let endpoint;
  let amountChange;
  if (isInCart && currentAmount > 1) {
    endpoint = `https://techstore-3fvk.onrender.com/api/v1/carts/remove/product/${cart.id}`;
    amountChange = 1;
  } else if (isInCart && currentAmount === 1) {
    endpoint = `https://techstore-3fvk.onrender.com/api/v1/carts/remove/product/${cart.id}`;
    amountChange = 1;
  } else {
    endpoint = `https://techstore-3fvk.onrender.com/api/v1/carts/add/product/${cart.id}`;
    amountChange = 1;
  }

  setIsAdding(true);
  setItemId(item.id);

  try {
    const response = await axios.put(
      endpoint,
      {},
      {
        params: {
          productId: item.id,
          productAmount: amountChange,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCart(response.data);

    const updatedIds = response.data.products
      ? response.data.products.map((p) => p.id)
      : Object.keys(response.data.amounts || {}).map((id) => parseInt(id));

    setCartItems(updatedIds);
  } catch (err) {
    console.error("Cart update failed:", err);
  } finally {
    setIsAdding(false);
    setItemId(null);
  }
};


useEffect(() => {
  if (!name) {
    if (category) {
      const categoryFiltered = items.filter(item => item.category === category);
      setFilteredItems(categoryFiltered);
      setOriginalItems(categoryFiltered);
    } else {
      setFilteredItems(items);
      setOriginalItems(items);
    }

    setResetClicked(true);
    return;
  }

  const query = (name || "").trim().toLowerCase();



  const filtered = query
    ? (items || []).filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    : (items || []);
    

    
  console.log("Filtered items:", filtered);

  setFilteredItems(filtered);
  setResetClicked(false);   


  if (query)   window.scrollTo({ top: 500, behavior: "smooth" });

  if(!query) {
    setFilteredItems(originalItems)
  }
}, [items, name]);

const navigate = useNavigate();

useEffect(() => {
  if (category) {
      const filtered = items.filter(item => item.category === category);
    setOriginalItems(filtered);
    setFilteredItems(filtered);
    setResetClicked(false);
    window.scrollTo({ top: 500, behavior: "smooth" });


  } 

}, [category, items]);

  const[itemId, setItemId] = useState();


const handleFilterClick = () => {
  const filtered = applyFilters(filteredItems, sortOptions);
  setFilteredItems(filtered);
  setResetClicked(false);
  const moreCheckbox = document.querySelector('input[name="more"]');
  if (moreCheckbox) moreCheckbox.checked = false;
  window.scrollTo({ top: 500, behavior: "smooth" });
};


const handleReset = () => {
  
  setResetClicked(true);
  setFilteredItems(originalItems)
  if (onResetFilters) onResetFilters();

};


  
const handleSortChange = (key, value) => {
  setSortOptions(prev => {
    const newOptions = Object.keys(prev).reduce((acc, k) => {
      acc[k] = null;
      return acc;
    }, {});
    newOptions[key] = value; 
    return newOptions;
  });
};

 const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 32;

    const totalItems = filteredItems ? filteredItems.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems
    ? filteredItems.slice(startIndex, startIndex + itemsPerPage)
    : [];

const displayItems = currentItems.length ? currentItems : [];




    return (
        <>        
        <div className={styles.container} style={displayItems.length === 0 || resetClicked ?{ marginBottom: "2rem"} : {marginBottom: "2rem"}}>
        <div className={styles.cover}>

          <div className={styles.subtitle}>
            <p>From phones to TVs discover it all</p>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>

          </div>
        </div>
            <div className={styles.barContainer}>
                <div className={styles.bar}>
                  <div className={styles.inBar}></div>
                    <button className={styles.filter}
                    onClick={handleFilterClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960" 
                        fill="#000000ff">
                        <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z"/>
                        </svg>
                        Filter
                    </button>
                    
                    <form ref={scrollRef}  className={styles.input}>
                      <div className={styles.inputBar}>
                      <input type="text" maxLength={100} placeholder="Enter the product name" 
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
                        viewBox="0 -960 960 960"
                        fill="#757575ff">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                      </div>

                      <button
                        className={styles.toggleButton}
                        onClick={() => setShowCategories(prev => !prev)}
                      >
                        Categories
                      </button>
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
                         viewBox="0 -960 960 960" 
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
                            id="rating"
                            name="sortOption"
                            onChange={() => handleSortChange("searchRating", "highToLow")}
                          />
                          <label htmlFor="rating">Most Searched</label>
                        </div>
                        <div className={styles.AZ}>
                          <input
                            type="radio"
                            id="alphabeticalLow"
                            name="sortOption"
                            onChange={() => handleSortChange("alphabetical", "lowToHigh")}
                          />
                          <label htmlFor="alphabeticalLow">Alphabetical: A → Z</label>
                        </div>
                        <div className={styles.ZA}>
                          <input
                            type="radio"
                            id="alphabeticalHigh"
                            name="sortOption"
                            onChange={() => handleSortChange("alphabetical", "highToLow")}
                          />
                          <label htmlFor="alphabeticalHigh">Alphabetical: Z → A</label>
                        </div>
                        <div className={styles.inStock}>
                          <input
                            type="radio"
                            id="inStock"
                            name="sortOption"
                            onChange={() => handleSortChange("stock", "highToLow")}
                          />
                          <label htmlFor="inStock">Available</label>
                        </div>
                         <div className={styles.outOfStock}>
                          <input
                            type="radio"
                            id="outOfStock"
                            name="sortOption"
                            onChange={() => handleSortChange("stock", "lowToHigh")}
                          />
                          <label htmlFor="outOfStock">Sold Out</label>
                        </div>
                        <div className={styles.highestRating}>
                          <input
                            type="radio"
                            id="highestRating"
                            name="sortOption"
                            onChange={() => handleSortChange("rating", "highToLow")}
                          />
                          <label htmlFor="highestRating">Highest Rating</label>
                        </div>
                        <div className={styles.lowestRating}>
                          <input
                            type="radio"
                            id="lowestRating"
                            name="sortOption"
                            onChange={() => handleSortChange("rating", "lowToHigh")}
                          />
                          <label htmlFor="lowestRating">Lowest Rating</label>
                        </div>

                        <div className={styles.discount}>
                          <input
                            type="radio"
                            id="discount"
                            name="sortOption"
                            onChange={() => handleSortChange("discount", "highToLow")}
                          />
                          <label htmlFor="discount">Discounted Items</label>
                        </div>

                          <p className={styles.moreText}>Make browsing faster and more precise</p>
                      </div>




                    </label>




                    </form>
                    
                   </div>

                    <div className={styles.itemContainer}>

                    <div  className={`${styles.categorySelector} ${showCategories ? styles.open : ""}`}>
                      <button className={styles.computer} onClick={() => {navigate("/product", { state: { category: "COMPUTER" } });
                                      setShowCategories(prev => !prev)}}>Computers
                        <svg style={{top:"3.2rem"}} xmlns="http://www.w3.org/2000/svg"

                        viewBox="0 -960 960 960">
                          <path d="M40-120v-80h880v80H40Zm120-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z"/></svg>
                      </button>
                      <button className={styles.mobilePhone} onClick={() => {navigate("/product", { state: { category: "MOBILE_PHONE" } });
                                      setShowCategories(prev => !prev)}}>Mobile Phones
                        <svg style={{top:"7rem"}}xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960"
                        ><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm200-40q17 0 28.5-11.5T520-200q0-17-11.5-28.5T480-240q-17 0-28.5 11.5T440-200q0 17 11.5 28.5T480-160Z"/></svg>
                      </button>
                      <button className={styles.tv} onClick={() => {navigate("/product", { state: { category: "TV" } });
                                      setShowCategories(prev => !prev)}}>TVs
                        <svg style={{top:"10.85rem"}} xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 -960 960 960"
                        ><path d="M320-120v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v480q0 33-23.5 56.5T800-200H640v80H320ZM160-280h640v-480H160v480Zm0 0v-480 480Z"/></svg>
                      </button>
                      <button className={styles.watch } onClick={() => {navigate("/product", { state: { category: "SMART_WATCH" } });
                                      setShowCategories(prev => !prev)}}>Smart Watches
                      <svg style={{top:"14.7rem"}} xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960">
                        <path d="M420-800h120-120Zm0 640h120-120Zm-60 80-54-182q-48-38-77-95t-29-123q0-66 29-123t77-95l54-182h240l54 182q48 38 77 95t29 123q0 66-29 123t-77 95L600-80H360Zm120-200q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm-76-470q20-5 38.5-8t37.5-3q19 0 37.5 3t38.5 8l-16-50H420l-16 50Zm16 590h120l16-50q-20 5-38.5 7.5T480-200q-19 0-37.5-2.5T404-210l16 50Z"/></svg>
                      </button>
                      <button className={styles.keyboard} onClick={() => {navigate("/product", { state: { category: "KEYBOARD" } });
                                      setShowCategories(prev => !prev)}}>Keyboards
                        <svg style={{top:"18.55rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z"/></svg>
                      </button>
                      <button className={styles.headphone} onClick={() => {navigate("/product", { state: { category: "HEADPHONE" } });
                                      setShowCategories(prev => !prev)}}>Headphones
                        <svg style={{top:"22.43rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z"/></svg>
                      </button>
                      <button className={styles.monitor} onClick={() => {navigate("/product", { state: { category: "MONITOR" } });
                                    setShowCategories(prev => !prev)}}>Monitors
                       <svg style={{top:"26.25rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-120v-80l40-40H160q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H680l40 40v80H240Zm-80-200h640v-440H160v440Zm0 0v-440 440Z"/></svg>
                      </button>
                      <button className={styles.tablet} onClick={() => {navigate("/product", { state: { category: "TABLET" } });
                                    setShowCategories(prev => !prev)}}>Tablets
                        <svg style={{top:"30.1rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-140q17 0 28.5-11.5T520-180q0-17-11.5-28.5T480-220q-17 0-28.5 11.5T440-180q0 17 11.5 28.5T480-140ZM200-40q-33 0-56.5-23.5T120-120v-720q0-33 23.5-56.5T200-920h560q33 0 56.5 23.5T840-840v720q0 33-23.5 56.5T760-40H200Zm0-200v120h560v-120H200Zm0-80h560v-400H200v400Zm0-480h560v-40H200v40Zm0 0v-40 40Zm0 560v120-120Z"/></svg>
                      </button>
                    </div>
                      <ul className={styles.items}>
                       {displayItems && displayItems.length > 0 ? (displayItems.map((item) => {
                        const isInCart = cartItems.includes(item.id);

                        return(
                        <Link key={item.id} className={styles.item} to={"/product/" + item.id}>
                          <div className={styles.info}>
                            <img src={item.productImageUrl} alt={item.name} />
                          </div>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guaranteeTitle}>Guarantee</p>
                            <p className={styles.guarantee}>{item.guarantee ?? 0} month</p>
                            <p className={styles.availTitle}>Available</p>
                            <p className={styles.avail}>{item.amount}</p>
                            <p className={styles.priceTitle}>Price</p>
                            <p className={styles.price}>{item.price ?? 0}₼</p>
                            <button className={`${styles.cart} ${isInCart ? styles.inCart : ""}`}
                            onClick={(e) => {
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  updateCart(item);
                            }}
                            onMouseEnter={() => {setIsHovered(true);setHoverId(item.id)}}
                            onMouseLeave={() => {setIsHovered(false);setHoverId(0)}}>
                             {(isAdding && itemId == item.id) ? (
                                      <>
                                         <div className={styles.cartSpinnerDiv}>
                                             <div className={styles.spinner}></div>
                                        </div>
                                      </>
                                 ) : (<></>
                              )} 
                              <p className={styles.cartText} style={{opacity: isHovered && hoverId == item.id ? "1" : "0"}}>{isInCart ? "In Cart" : "Add to Cart"}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                                </svg>
                            </button>
                        </Link>
                      
                    
                        )})) : (
                            <li className={styles.noItem}>
                              <p>No item found</p>
                            </li>)}
                      </ul>
                        {totalPages > 1 && (
                         <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, i) => (
                           <button
                              key={i}
                             onClick={() => setCurrentPage(i + 1)}
                             className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ""}`}
                             >
                               {i + 1}
                             </button>
                          ))}
                         </div>
                        )}
                    </div>
                    </div>
                  </div>
        </>
    );
}


export default Filter;