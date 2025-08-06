import styles from "./Nav.module.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

function Nav({ highlight }) {
 const [is480, setIs480] = useState(window.innerWidth === 480);
 const [menuOpen, setMenuOpen] = useState(false);



  useEffect(() => {
    const handleResize = () => {
      setIs480(window.innerWidth > 480);
    };

    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const less480 = (<>
                <div>
                    <div className={styles.board}  onClick={() => setMenuOpen(prev => !prev)}>☰</div>
                    {menuOpen && (
                        <div className={highlight ? styles.highmenu : styles.menu}>
                            <Link id={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
                            <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/about">About</Link>
                            <Link id={styles.contact} className={highlight ? styles.highlight : ""} to="/contact">Contact</Link>
                            <Link id={styles.login} className={highlight ? styles.highlight : ""} to="/login">Account</Link> 
                        </div>  
                        )}
                </div>
                </>)

  const greater480 = (<>
                        <Link id ={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
                        <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/about">About</Link>
                        <Link id={styles.contact} className={highlight ? styles.highlight : ""} to="/contact">Contact</Link>
                        <Link id={styles.login} className={highlight ? styles.highlight : ""} to="/login">Account</Link>
                    </>)


    return (
        <>
            <div className={highlight ? styles.highcontainer : styles.container}>

                <ul className={styles.navbar}>
                    <Link id={styles.name} className={highlight ? styles.highlight : ""} to="/">TechStore</Link>
                    {is480 ? greater480 : less480}
                    <div className={styles.inputBar}>
                       <input type="text" placeholder="Enter the product name"/>
                        <svg className={styles.search}
                        xmlns="http://www.w3.org/2000/svg" 
                        height="28px" 
                        viewBox="0 -960 960 960"
                        width="28px" 
                        fill="#757575ff">
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                    </div>
                </ul>
            </div>
        
        </>


    );
}

export default Nav