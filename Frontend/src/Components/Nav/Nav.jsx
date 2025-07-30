import styles from "./Nav.module.css"
import { Link } from "react-router-dom";

function Nav({ highlight }) {


    return (
        <>
            <div className={styles.container}>

                <ul className={styles.navbar}>
                    <Link id={styles.name} className={highlight ? styles.highlight : ""} to="/">TechStore</Link>
                    <Link id ={styles.campaign} className={highlight ? styles.highlight : ""} to="/campaign">Campaign</Link>
                    <Link id={styles.about} className={highlight ? styles.highlight : ""} to="/about">About</Link>
                    <Link id={styles.contact} className={highlight ? styles.highlight : ""} to="/contact">Contact</Link>
                    <Link id={styles.login} className={highlight ? styles.highlight : ""} to="/login">Login / Signup</Link>
                </ul>
            </div>
        
        </>


    );
}

export default Nav