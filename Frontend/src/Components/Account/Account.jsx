import styles from "./Account.module.css"
import { Link } from "react-router-dom";

function Account({ account }) {
    return (<>
        <div className={styles.container}>
            <div className={styles.account}>
                <img className={styles.pp} src={account.profilePictureUrl} alt="Profile" />
                {account.backgroundImageUrl ? (<></>) : <></>}
                <div className={styles.name}>
                    <p className={styles.customerName}>{account.customerName}</p>
                    <p className={styles.username}>@{account.username}</p>
                </div>
            </div>
            <p className={styles.descriptionTitle}>Description</p>
            <div className={styles.accountDescription}>
                <p className={styles.description}>{account.description}</p>
            </div>
            <div className={styles.itemsContainer}>
                <p className={styles.itemTitle}>Items</p>
                      <ul className={styles.items}>
                       {account.products && account.products.length > 0 ? ((account.products).map((item) => (
                          <Link key={item.id} className={styles.item} 
                          to= {"/product/" + item.id}
                          style={{ backgroundColor: "rgba(247, 247, 247, 1)" }}>
                            <img src={item.productImageUrl} alt={item.name}/>
                            <div className={styles.info}>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <p className={styles.price}>₼{item.price}</p>
                            </div>
                          </Link>
                        ))) : (
                            <li className={styles.noItem}>
                              <p>No item found</p>
                            </li>)}
                      </ul>
            </div>


        </div>
    </>)
}

export default Account;