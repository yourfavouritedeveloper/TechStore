import styles from "./Body.module.css"
import Macbook from "../assets/Macbook.png"
import Iphone from "../assets/iphone.png"

function Body() {
    return(
        <>
            <div className={styles.container}>
                <p className={styles.title}>Categories</p>
                <ul className={styles.categories}>


                    <li className={styles.computers}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                        
                        <p>Computers</p>
                        <img src={Macbook} alt="Computers" />
                        </li>



                    <li className={styles.mobilePhones}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                            
                        <p>Phones</p>
                        <img src={Iphone} alt="Phones" />
                    </li>
                    <li className={styles.tvs}>TVs</li>
                    <li className={styles.smartWatches}>Smart Watches</li>
                    <li className={styles.keyboards}>Keyboards</li>
                    <li className={styles.headphones}>Headphones</li>
                    <li className={styles.monitors}>Monitors</li>
                    <li className={styles.tablets}>Tablets</li>
                </ul>
            </div>
        </>

    );
}


export default Body;