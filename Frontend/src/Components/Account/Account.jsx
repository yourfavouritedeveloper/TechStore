import styles from "./Account.module.css"

function Account({ account }) {
    console.log(account.profilePictureUrl)
    return (<>
        <div className={styles.container}>
            {account?.profilePictureUrl && (
                <img src={account.profilePictureUrl} alt="Profile" />
                )}


        </div>
    </>)
}

export default Account;