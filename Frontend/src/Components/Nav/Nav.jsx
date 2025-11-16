import styles from "./Nav.module.css"
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useContext } from 'react';
import def from "/default.png";
import axios from 'axios';
import { AuthContext } from "../AuthContext";
import spinner from "../../../public/brandlogowhite.png"
import { usePurchase } from "../../Components/Utils/PurchaseContext";
import { ShoppingCart, User, Menu, Search } from "lucide-react";

const USERNAME = import.meta.env.VITE_API_USERNAME;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Nav({ highlight, shiftUp, setShiftUp, onEditClick = () => { } }) {
  const [is750, setIs750] = useState(window.innerWidth === 750);
  const [menuOpen, setMenuOpen] = useState(false);
    const [boardOpen, setBoardOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false)
  const { account, logout,token, refreshToken,refreshAccessToken } = useContext(AuthContext);
  const [logAccount, setLogAccount] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { setIsPurchase } = usePurchase();
  const navigate = useNavigate();

      const [logoText, setLogoText] = useState(window.innerWidth <= 580 ? "TS" : "TechStore");

    useEffect(() => {
      const handleResize = () => {
        setLogoText(window.innerWidth <= 580 ? "TS" : "TechStore");
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);


const fetchAccount = async () => {
  
  if (!account?.username || !token) return;

  try {
    if (!token && refreshToken) {
      await refreshAccessToken(); 
    }


    const res = await axios.get(
      `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${account.username}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setLogAccount(res.data);
  } catch (err) {
    console.error("Error fetching account:", err.response?.status, err.response?.data);
    if (err.response?.status === 403) {
      logout();
    }
  }
};

useEffect(() => {
  fetchAccount();
}, [account, token,refreshToken,refreshAccessToken]);

  


  useEffect(() => {
    const handleResize = () => {
      setIs750(window.innerWidth > 750);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

const handleSignOut = () => {
  logout(); 
  window.location.reload();
};



  useEffect(() => {
    if (!logAccount || logAccount?.profilePictureUrl) return;

    const defaultPicUrl = "https://github.com/yourfavouritedeveloper/TechStore/blob/main/Frontend/public/default.png?raw=true";

    const accountToUpdate = {
      ...logAccount,
      profilePictureUrl: defaultPicUrl
    };

    axios.put(
      `https://techstore-3fvk.onrender.com/api/v1/accounts/update`,
      accountToUpdate,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        if (response.data?.profilePictureUrl) {
          setLogAccount(response.data);
        }
      })
      .catch(err => console.error(err));
  }, [logAccount]);




  const guest = (<>
  <div className={styles.accountDiv}>
     <div className={styles.header}>
            <p className={styles.title}>Account</p>
            <button
              className={styles.closeBtn}
              onClick={() => setMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" width="24px" 
              fill="#ffffff">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
      </div>
    <p className={styles.signTitle}>Oops! It looks like you’re currently browsing in Guest mode. </p>
    <p className={styles.signSubtitle}>To access your account features like order history, saved preferences, and personalized settings, please log in or create an account. We’d love to have you on board!"</p>
    <Link className={styles.signup} to="/login" state={{ sign: true }}>
   <svg xmlns="http://www.w3.org/2000/svg" 
   height="24px" 
   viewBox="0 -960 960 960" width="24px" 
   fill="rgba(175, 141, 255, 1)"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg>
      Sign Up</Link>
    <Link className={styles.log} to="/login" state={{ sign: false }}>
     <svg xmlns="http://www.w3.org/2000/svg"
     height="24px" viewBox="0 -960 960 960"
      width="24px" 
      fill="rgba(175, 141, 255, 1)"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
      Log In</Link>
  </div>

  </>);

const logged = (
  <>
    {logAccount ? (
      <>


        <div
          className={styles.panel}
          style={{ right: menuOpen ? "0" : "-100%" }}
        >
          <div className={styles.header}>
            <p className={styles.title}>Account</p>
            <button
              className={styles.closeBtn}
              onClick={() => setMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" width="24px" 
              fill="#ffffff">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </button>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              <img
                className={styles.avatar}
                src={logAccount.profilePictureUrl ? logAccount.profilePictureUrl : def}
                alt="Profile"
              />
              <div className={styles.statusDot}></div>
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{logAccount.customerName}</p>
              <p className={styles.userEmail}>@{logAccount.username}</p>
              <p className={styles.memberSince}>Member since 2025</p>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <p className={styles.statValue}>${logAccount.balance}</p>
              <p className={styles.statLabel}>Balance</p>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <p className={styles.statValue}>12</p>
              <p className={styles.statLabel}>Orders</p>
            </div>
          </div>

          <div className={styles.menu}>
            <div
              className={styles.menuItem}
              onClick={() => navigate(`/account/${logAccount.username}`)}
            >
              <div className={styles.menuItemLeft}>
                <div className={styles.menuIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="rgba(175, 141, 255, 1)"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                </div>
                <p>View Profile</p>
              </div>
            </div>

            <div
              className={styles.menuItem}
              onClick={() => navigate(`/account/${logAccount.username}/cart`)}
            >
              <div className={styles.menuItemLeft}>
                <div className={styles.menuIcon}><svg xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" fill="rgba(175, 141, 255, 1)"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg></div>
                <p>View Cart</p>
              </div>
              <p className={styles.menuCount}>{logAccount.cart.products.length}</p>
            </div>

          <div
            className={styles.menuItem}
            onClick={(e) => {
              e.preventDefault();
              setIsPurchase(true);
              navigate(`/account/${logAccount.username}`, {
                state: { isHistory: true },
              });
            }}
          >
            <div className={styles.menuItemLeft}>
              <div className={styles.menuIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="rgba(175, 141, 255, 1)"
                >
                  <path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z" />
                </svg>
              </div>
              <p>Purchase History</p>
            </div>
          </div>
          </div>

          <button
            className={styles.logoutBtn}
            onClick={handleSignOut}
          >
            <svg xmlns="http://www.w3.org/2000/svg" 
            height="24px" 
            viewBox="0 -960 960 960" 
            width="24px" fill="#ef4444"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg> Sign Out
          </button>

          <div className={styles.footer}>
            <p>
              © 2025 TechStore •{" "}
              <a href="/terms">Terms & Privacy</a>
            </p>
          </div>
        </div>
      </>
    ) : (
      <div className={styles.loadingContainer}>
        <img src={spinner} alt="Loading..." className={styles.loadingImage} />
      </div>
    )}
  </>
);


  const less750 = (<>
    <div className={highlight ? styles.highcontainer : ""}>
      <div className={styles.board} onClick={() => setBoardOpen(prev => !prev)}>
   <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 -960 960 960" 
    fill="#000000">
      <path d="M120-200v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z"/></svg>
      </div>
      {boardOpen && (
        <div className={highlight ? styles.highmenu : styles.menu}>
          <Link id={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
          <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/product">Market</Link>
          <Link id={styles.contact} className={highlight ? styles.highlight : ""}   onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth"
            });
          }}>Contact</Link>

        </div>
        
      )}
    <Link
      id={styles.login}
      style={{ 
        opacity: menuOpen ? "0" : "1", 
        pointerEvents: logAccount?.username ? "auto" : "none",
        cursor: logAccount?.username ? "pointer" : "default" 
      }}
      className={highlight ? styles.highlightAccount : ""}
      to={logAccount?.username ? `/account/${logAccount.username}` : `/login`}
    >
      <svg xmlns="http://www.w3.org/2000/svg"  
      viewBox="0 -960 960 960" 
      fill="#ffffffff"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
    </Link>
    </div>
  </>)

  const greater750 = (<>
    <Link id={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
    <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/product">Market</Link>
    <Link id={styles.contact} className={highlight ? styles.highlight : ""}   onClick={(e) => {
      e.preventDefault();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }}>Contact</Link>
    <Link id={styles.login} style={{ opacity: menuOpen ? "0" : "1" }} className={highlight ? styles.highlight : ""} onClick={() => setMenuOpen(prev => !prev)}>

      Account
    </Link>

  </>)





  return (
    <>
      <div className={highlight && is750 ? styles.highcontainer : styles.normal}></div>
      <nav className={styles.container}>


        <ul className={styles.navbar}>
          <Link id={styles.name} className={highlight ? styles.highlightName : ""} to="/"  onClick={(e) => {
            if (window.location.hash === "#/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}>{logoText}</Link>
          {is750 ? greater750 : less750}
          <div className={ highlight ? styles.highlightInputBar : styles.inputBar}>
            <input type="text" maxLength={50} placeholder="Enter the product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  console.log(searchTerm);
                  navigate("/product", { state: { search: searchTerm, category: null } });
                }
              }}

            />
            <svg className={styles.search}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="#757575ff">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
          </div>
        </ul>
      </nav>
        <div
            className={styles.backdrop}
            style={{opacity: menuOpen ? "1" : "0"}}
            onClick={() => setMenuOpen(false)}
        ></div>

      <div
        className={styles.loginSection}
        style={{
          transform: menuOpen ? "translateX(-50%)" : "translateX(20rem)",
          pointerEvents: menuOpen ? "auto" : "none"
        }}
      >
        <div className={styles.accountDiv}>

          {account ? logged : guest}
        </div>
      </div>

    </>


  );
}

export default Nav