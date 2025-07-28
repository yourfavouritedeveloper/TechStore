import styles from "./Body.module.css"
import Iphone from "../assets/iphone.png"
import Macbook from "../assets/macbook.png"
import TV from "../assets/tv.png"
import Watch from "../assets/watch.png"
import Keyboard from "../assets/keyboard.png"
import Headphone from "../assets/headphone.png"
import Monitor from "../assets/monitor.png"
import Tablet from "../assets/tablet.png"


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



                    <li className={styles.tvs}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span> 
                        <p>TVs</p>
                        <img src={TV} alt="tvs" />
                        
                    </li>



                    <li className={styles.smartWatches}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span> 
                        <p>Watches</p>
                        <img src={Watch} alt="watches" />
                        </li>




                    <li className={styles.keyboards}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span> 
                        <p>Keyboards</p>
                        <img src={Keyboard} alt="keyboards" />
                    </li>



                    <li className={styles.headphones}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                         
                        <p>Headphones</p>
                        <img src={Headphone} alt="headphones" />                        
                        </li>



                    <li className={styles.monitors}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>    
                        <p>Monitors</p>
                        <img src={Monitor} alt="monitors" />                        
                        </li>



                    <li className={styles.tablets}>
                        <span className={styles.circle1}></span>
                        <span className={styles.circle2}></span>
                        <span className={styles.circle3}></span>    
                        <span className={styles.circle4}></span>                         
                        <p>Tablets</p>
                        <img src={Tablet} alt="tablets" />                           
                    </li>
                </ul>
            </div>
        </>

    );
}


export default Body;