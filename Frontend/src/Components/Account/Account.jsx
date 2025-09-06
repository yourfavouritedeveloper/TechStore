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


        </div>
    </>)
}

export default Account;