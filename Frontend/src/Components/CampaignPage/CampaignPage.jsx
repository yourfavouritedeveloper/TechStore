import Campaign from "../Campaign/Campaign";
import styles from "./CampaignPage.module.css"
import Watch from "../../assets/orangeWatch.png";

function CampaignPage () {
    return (<>
    <div className={styles.container}>
        <div className={styles.campaignDiv}>
            <p className={styles.title}>Exclusive Campaigns</p>
            <p className={styles.subtitle}>Discover limited-time promotions and special member-only deals tailored to your interests. Enjoy early access to new releases, premium discounts.</p>
            <button className={styles.explore}>Explore Deals</button>
        </div>
    </div>

    </>);
}

export default CampaignPage;