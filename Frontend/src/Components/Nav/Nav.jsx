import styles from "./Nav.module.css"
import { Link ,useNavigate} from "react-router-dom";
import { motion, AnimatePresence} from "framer-motion";
import { useEffect, useState,useContext } from 'react';
import def from "/default.png";
import axios from 'axios';
import { AuthContext } from "../AuthContext";
import spinner from "../../../public/brandlogowhite.png"


function Nav({ highlight ,shiftUp, setShiftUp }) {
 const [is599, setIs599] = useState(window.innerWidth === 599);
 const [menuOpen, setMenuOpen] = useState(false);
 const [accountMenu, setAccountMenu] = useState(false)
 const { account, logout } = useContext(AuthContext);
 const [logAccount, setLogAccount] = useState();
 const [searchTerm, setSearchTerm] = useState("");
 const [filteredItems, setFilteredItems] = useState([]); 

  const navigate = useNavigate();

  
 useEffect(() => {
    if (!account?.username || !account?.password) return;
    axios.get("https://techstore-3fvk.onrender.com/api/v1/accounts/username/" + account.username , {
    auth: {
      username: account.username,
      password: account.password
    }
  }) 
      .then(response => {
        setLogAccount(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [account]);


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

  axios.put(
    `https://techstore-3fvk.onrender.com/api/v1/accounts/update/${logAccount.username}`,
    null,
    {
      params: { profilePictureUrl: defaultPicUrl },
      auth: {
        username: account.username,
        password: account.password
      }
    }
  )
  .then(response => {
    if (response.data?.profilePictureUrl) {
      setLogAccount(response.data);
    }
  })
  .catch(err => console.error(err));
}, [logAccount]);




  const guest = (<>
    <p className={styles.logName}>Account</p>
    <p className={styles.title}>Oops! It looks like you’re currently browsing in Guest mode. </p>
    <p className={styles.subtitle}>To access your account features like order history, saved preferences, and personalized settings, please log in or create an account. We’d love to have you on board!"</p>
    <Link className={styles.signup}  to="/login" onClick={() => setShiftUp?.(true)}>
      Sign Up</Link>
    <Link className={styles.log}  to="/login" onClick={() => setShiftUp?.(false)}>Log In</Link>

  
  </>);

  const logged = (<>
    {logAccount ? (
      <>
        <p className={styles.logName}>Account</p>
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
          <Link className={styles.purchaseButton} to="/login">
            Purchase History
          </Link>
        </div>

        <Link className={styles.view} to={`/account/${logAccount.username}`}>
          View Profile
        </Link>

        <Link className={styles.edit} to="/login">
          Edit Profile
        </Link>

        <Link className={styles.signout} to="/" onClick={handleSignOut}>
          Sign Out
        </Link>
      </>
    ) : (
      <div className={styles.loadingContainer}>
        <img src={spinner} alt="Loading..." className={styles.loadingImage} />
      </div>
    )}
  </>);


  const less599 = (<>
                <div>
                    <div className={styles.board}  onClick={() => setMenuOpen(prev => !prev)}>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        height="24px" 
                        viewBox="0 -960 960 960" 
                        width="24px" 
                        fill="#000000">
                        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
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
                                  exit={{ x: "80rem"}}    
                                  transition={{ duration: 0.3}}
                                >
                                  {account ? logged : guest}
                                </motion.div>) }
                              </AnimatePresence>
                            </Link> 
                        </div>  
                        )}
                </div>
                </>)

  const greater599 = (<>
                        <Link id ={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
                        <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/about">About</Link>
                        <Link id={styles.contact} className={highlight ? styles.highlight : ""} to="/contact">Contact</Link>
                        <Link id={styles.login} className={highlight ? styles.highlight : "" }  onClick={() => setMenuOpen(prev => !prev)}>
                        
                        Account 
                        <AnimatePresence>
                        {menuOpen && (
                              <motion.div
                                className={styles.loginSection}
                                initial={{ x: "30rem", opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }}       
                                exit={{ x: "80rem"}}    
                                transition={{ duration: 0.3}}
                            >
                            {account ? logged : guest}
                        </motion.div>) }
                        </AnimatePresence>
                        </Link>
                    </>)





    return (
        <>
            <nav className={highlight ? styles.highcontainer : styles.container}>

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
                        height="28px" 
                        viewBox="0 -960 960 960"
                        width="28px" 
                        fill="#757575ff">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                    </div>
                </ul>
            </nav>
        
        </>


    );
}

export default Nav