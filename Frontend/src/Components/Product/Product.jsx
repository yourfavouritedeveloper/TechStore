import styles from "./Product.module.css"
import Keyboard from "../../assets/keyboard.png";
import Iphone from "../../assets/iphone.png";
import Macbook from "../../assets/macbook.png";

function Product({shopRef}) {

    function scroll() {
        window.scrollTo({ top: 500, behavior: 'smooth' });
    }

    return (<>
    <div ref={shopRef} className={styles.container}>
        <p className={styles.title}>Explore All Products</p>
        <img className={styles.macbook} src={Macbook} alt="" />
        <div className={styles.macbookBox}>
            <p className={styles.macbookDescription}>
                Find, compare, and buy your great match in just a few clicks.
            </p>
        </div>

        <div className={styles.macbookHoverContainer}>
            <div className={styles.hoverArea}>
                <img className={styles.keyboard} src={Keyboard} alt="" />
                <img className={styles.iphone} src={Iphone} alt="" />
            </div>

            <button className={styles.macbookButton} onClick={scroll}>Explore now!</button>
        </div>
      
    </div>
    </>);
}


export default Product