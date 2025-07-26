import styles from "./Nav.module.css"


function Nav() {
    return (
        <>
            <div className={styles.container}>

                <ul className={styles.navbar}>
                    <li className={styles.name}>
                        <a href="" >TechStore</a>
                    </li>
                    <li className={styles.campaign}>
                        <a href="">Campaign</a>
                    </li>
                    <li className={styles.about}>
                        <a href="">About</a>
                    </li>
                    <li className={styles.contact}>
                        <a href="">Contact</a>
                    </li>
                    <li className={styles.login}>
                        <a href="">Login / Signup</a>
                    </li>
                </ul>
            </div>
        
        </>


    );
}

export default Nav