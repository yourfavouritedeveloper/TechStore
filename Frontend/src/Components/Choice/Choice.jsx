import { motion } from "framer-motion";
import styles from "./Choice.module.css"
import { Link } from "react-router-dom";


function Choice({item,setIsChoice}) {
    return (
        <>
            <div className={styles.container}>

<motion.div
  className={styles.choice}
  initial={{ y: 100}}     
  animate={{ y: 0}}    
  transition={{ duration: 0.5 }}
>
  <button className={styles.close}  onClick={() => setIsChoice(false)}>
    <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 -960 960 960" >
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>
  </button>
  <p className={styles.title}>Choose the way you want to buy this product</p>

  <div className={styles.bestStore}>
    <div className={styles.bestStoreBox}>
        <p className={styles.subtitle}>Best Store Picks</p>
        <p className={styles.subsubtitle}>Stores are choosen based on the certain items price, rating, etc.</p>
    </div>
    <Link className={styles.buy} to={"/bestStore/" + item.id}>Buy now</Link>

  </div>

  <div className={styles.community}>
    <div className={styles.communityBox}>
        <p className={styles.subtitle}>Community Shop</p>
        <p className={styles.subsubtitle}>Invidivual sellers where the item can either be fresh or second-hand</p>
    </div>
    <Link className={styles.buy} to={"/community/" + item.id}>Buy now</Link>

  </div>
</motion.div>

            </div>
        
        </>
    );
}


export default Choice;