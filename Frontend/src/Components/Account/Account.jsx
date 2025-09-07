import styles from "./Account.module.css"

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
                <div className={styles.items}></div>
            </div>


        </div>
    </>)
}

export default Account;