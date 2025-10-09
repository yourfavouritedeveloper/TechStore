import styles from "./Cart.module.css"

function Cart() {



    return (<>
        <div className={styles.container}>
            <div className={styles.titleDiv}>

                <p className={styles.title}>Shopping Cart</p>

            </div>
            <div className={styles.cartDiv}>
            </div>
        </div>
    </>)
}

export default Cart;