import styles from "./Nav.module.css"
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useContext } from 'react';
import def from "/default.png";
import axios from 'axios';
import { AuthContext } from "../AuthContext";
import spinner from "../../../public/brandlogowhite.png"
import { usePurchase } from "../../Components/Utils/PurchaseContext";

const USERNAME = import.meta.env.VITE_API_USERNAME;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Nav({ highlight, shiftUp, setShiftUp, onEditClick = () => { } }) {
  const [is599, setIs599] = useState(window.innerWidth === 599);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false)
  const { account, logout,token, refreshToken,refreshAccessToken } = useContext(AuthContext);
  const [logAccount, setLogAccount] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { setIsPurchase } = usePurchase();
  const navigate = useNavigate();

  

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
      setIs599(window.innerWidth > 599);
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
    <p className={styles.logName} onClick={() => setMenuOpen(prev => !prev)}>Account</p>
    <p className={styles.title}>Oops! It looks like you’re currently browsing in Guest mode. </p>
    <p className={styles.subtitle}>To access your account features like order history, saved preferences, and personalized settings, please log in or create an account. We’d love to have you on board!"</p>
    <Link className={styles.signup} to="/login" state={{ sign: true }}>
      Sign Up</Link>
    <Link className={styles.log} to="/login" state={{ sign: false }}>Log In</Link>
  </div>

  </>);

  const logged = (<>
    {logAccount ? (
      <>
        <div className={styles.accountDiv}>
          <p className={styles.logName} onClick={() => setMenuOpen(prev => !prev)}>Account</p>
          <img
            className={styles.pp}
            src={logAccount.profilePictureUrl ? logAccount.profilePictureUrl : def}
            alt="Profile"
          />
          <p className={styles.fullname}>{logAccount.customerName}</p>
          <p className={styles.username}>@{logAccount.username}</p>
          <p className={styles.balance}>Balance: ${logAccount.balance}</p>

          <div className={styles.purchaseHistory}>
            <p className={styles.purchaseText}>
              Easily track your spending and review past transactions.
            </p>
            <Link className={styles.purchaseButton}
              onClick={(e) => {
                e.preventDefault();
                setIsPurchase(true);
                navigate(`/account/${logAccount?.username}`);
              }}>
              Purchase History
            </Link>
          </div>

          <Link className={styles.view} to={`/account/${logAccount.username}`}>
            View Profile
          </Link>

          <Link className={styles.edit} to={`/account/${logAccount.username}/cart`}>
            View Cart
          </Link>

          <Link className={styles.signout} to="/" onClick={handleSignOut}>
            Sign Out
          </Link>
        </div>
      </>
    ) : (
      <div className={styles.loadingContainer}>
        <img src={spinner} alt="Loading..." className={styles.loadingImage} />
      </div>

    )}
  </>);


  const less599 = (<>
    <div>
      <div className={styles.board} onClick={() => setMenuOpen(prev => !prev)}>
        <svg xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#000000">
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
      </div>
      {menuOpen && (
        <div className={highlight ? styles.highmenu : styles.menu}>
          <Link id={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
          <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/about">About</Link>
          <Link id={styles.contact} className={highlight ? styles.highlight : ""} to="/contact">Contact</Link>
          <Link id={styles.login} className={highlight ? styles.highlight : ""} onClick={() => setAccountMenu(prev => !prev)}>Account
            <AnimatePresence>
              {accountMenu && (
                <motion.div
                  className={styles.loginSection}
                  initial={{ x: "30rem", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "80rem" }}
                  transition={{ duration: 0.3 }}
                >
                  {account ? logged : guest}
                </motion.div>)}
            </AnimatePresence>
          </Link>
        </div>
      )}
    </div>
  </>)

  const greater599 = (<>
    <Link id={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
    <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/about">About</Link>
    <Link id={styles.contact} className={highlight ? styles.highlight : ""} to="/contact">Contact</Link>
    <Link id={styles.login} style={{ opacity: menuOpen ? "0" : "1" }} className={highlight ? styles.highlight : ""} onClick={() => setMenuOpen(prev => !prev)}>

      Account
    </Link>

  </>)





  return (
    <>
      <div className={highlight ? styles.highcontainer : styles.normal}></div>
      <nav className={styles.container}>


        <ul className={styles.navbar}>
          <Link id={styles.name} className={highlight ? styles.highlight : ""} to="/">TechStore</Link>
          {is599 ? greater599 : less599}
          <div className={styles.inputBar}>
            <input type="text" placeholder="Enter the product name"
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