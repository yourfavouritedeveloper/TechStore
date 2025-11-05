import Campaign from "../Campaign/Campaign";
import styles from "./CampaignPage.module.css"
import Watch from "../../assets/orangeWatch.png";
import { useContext, useEffect, useRef, useState } from "react";
import Apple from "../../assets/appleLogo.png"; 
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import spinner from "../../../public/brandlogo.png";
import Headphone from "../../assets/headphone.png";

function CampaignPage ({setHighlight}) {
    
    const ref = useRef();

    const handleScroll = () => {
    if (ref.current) {
        const elementTop = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const offset = -0;
        window.scrollTo({
        top: elementTop + offset,
        behavior: "smooth",
        });
    }
    };
    
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [hoverId, setHoverId] = useState(0);
    const { account, logout, token,refreshToken,refreshAccessToken } = useContext(AuthContext);
    const [logAccount, setLogAccount] = useState();
    const [isAdding, setIsAdding] = useState(false);



    const [cart, setCart] = useState();
    const [cartItems, setCartItems] = useState([]);

       useEffect(() => {
        const fetchAccount = async () => {
            if (!account?.username) return;

            try {
            const res = await axios.get(
                `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${account.username}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setLogAccount(res.data); 
            } catch (err) {
            console.error("Failed to fetch account:", err);
            }
        };

        fetchAccount();
        }, [account?.username, token]);

    const [appleItems,setAppleItems] = useState([]);

    useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/all")
        .then(response => {
        const filtered = response.data.filter(i => i.company === "Apple").slice(0, 5);
        setAppleItems(filtered);
        })
        .catch(error => {
        console.error("Error fetching data:", error);
        });
    }, []);


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

    


    useEffect(() => {
    const handleScroll = () => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const isAtOrBelow = rect.top <= 0;

        setHighlight(isAtOrBelow);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
    }, [setHighlight]);

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
        }
        };

    return appleItems.length > 0 ? (<>
    <div className={styles.container}>
        <div className={styles.campaignDiv}>
            <p className={styles.title}>Exclusive Campaigns</p>
            <p className={styles.subtitle}>Discover limited-time promotions and special member-only deals tailored to your interests. Enjoy early access to new releases, premium discounts.</p>
            <button className={styles.explore}  onClick={handleScroll}>Explore Deals</button>
        </div>

        <div className={styles.mainDiv} ref={ref}>
            <p className={styles.title}>Featured Deals</p>
            <div className={styles.campaign1}>
                <p className={styles.title1}>Save 30% on Apple Products</p>
                <img className={styles.apple} src={Apple} alt="" />
            </div>
            <div className={styles.appleDiv}>
                <ul className={styles.appleItems}>
                    {appleItems.map((i) => {
                        const isInCart = cartItems.includes(i.id);

                        return(
                        <Link className={styles.appleItem} to={"/product/" + i.id}>
                            <div className={styles.info}>
                                <img src={i.productImageUrl} alt={i.name} />
                            </div>
                            <p className={styles.nameOf}>{i.name}</p>
                            <p className={styles.guaranteeTitle}>Guarantee</p>
                            <p className={styles.guarantee}>{i.guarantee ?? 0} month</p>
                            <p className={styles.availTitle}>Available</p>
                            <p className={styles.avail}>{i.amount}</p>
                            <p className={styles.priceTitle}>Price</p>
                            <p className={styles.priceOf}>{i.price ?? 0}₼</p>
                            <button className={`${styles.cartOf} ${isInCart ? styles.inCartOf : ""}`}
                                onClick={(e) => {
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  updateCart(i);
                                }}
                                onMouseEnter={() => { setIsHovered(true); setHoverId(i.id) }}
                                onMouseLeave={() => { setIsHovered(false); setHoverId(0) }}>
                                    {isAdding ? (
                                       <>
                                            <div className={styles.cartSpinnerDivOf}>
                                                <div className={styles.spinnerOf}></div>
                                            </div>
                                       </>
                                     ) : (<></>
                                   )} 
                                <p className={styles.cartText} style={{ opacity: isHovered && hoverId == i.id ? "1" : "0" }}>{isInCart ? "In Cart" : "Add to Cart"}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                                </svg>
                            </button>
                        </Link>
                    )})}
                </ul>
            </div>
            <div className={styles.campaign2}>
                <p className={styles.title2}>Brand New Arrival — Apple AirPods Max</p>
                <p className={styles.subtitle2}>Experience next-level sound with the all-new Apple AirPods Max — where luxury design meets high-fidelity audio for unmatched clarity and comfort.</p>
                <button className={styles.explore} onClick={() => navigate("/product/16")}>Explore Now</button>
                <img className={styles.headphone} src={Headphone} alt="" />
            </div>
        </div>

    </div>

    </>) : (
            <div className={styles.loadingContainer}>
                <img src={spinner} alt="Loading..." className={styles.loadingImage} />
            </div>
        )
    };


export default CampaignPage;