import styles from "./Nav.module.css"


function Nav({ highlight }) {


    return (
        <>
            <div className={styles.container}>

                <ul className={styles.navbar}>
                    <li className={styles.name}>
                        <a className={highlight ? styles.highlight : ""} href="" >TechStore</a>
                    </li>
                    <li className={styles.campaign}>
                        <a className={highlight ? styles.highlight : ""} href="">Campaign</a>
                    </li>
                    <li className={styles.about}>
                        <a className={highlight ? styles.highlight : ""} href="">About</a>
                    </li>
                    <li className={styles.contact}>
                        <a className={highlight ? styles.highlight : ""} href="">Contact</a>
                    </li>
                    <li className={styles.login}>
                        <a className={highlight ? styles.highlight : ""} href="">Login / Signup</a>
                    </li>
                </ul>
            </div>
        
        </>


    );
}

export default Nav