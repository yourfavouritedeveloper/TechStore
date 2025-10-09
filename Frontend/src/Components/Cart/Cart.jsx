import axios from "axios";
import styles from "./Cart.module.css"
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

function Cart() {

    const { account, logout } = useContext(AuthContext);
    


    return (<>
        <div className={styles.container}>
            <div className={styles.div}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
                <div className={styles.titleDiv}>

                    <p className={styles.title}>Shopping Cart</p>

                </div>
                <div className={styles.cartDiv}>
                </div>
            </div>
        </div>
    </>)
}

export default Cart;