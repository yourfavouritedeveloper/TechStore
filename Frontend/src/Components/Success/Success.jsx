import styles from "./Success.module.css";
import { useEffect, useState } from "react";

function Success() {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const purchaseData = sessionStorage.getItem("checkoutPayload");
    if (purchaseData) {
      const parsedPurchase = JSON.parse(purchaseData);
      setPurchase(parsedPurchase); 
      console.log("Purchase info from checkout:", parsedPurchase);
      
      sessionStorage.removeItem("checkoutPayload");
    }
    setLoading(false); 
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading purchase details...</p>
        {/* optionally, add a spinner image */}
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className={styles.container}>
        <h1>Page is not accessible</h1>
        <p >Purchase information could not be found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Payment Successful!</h1>
      <pre>{JSON.stringify(purchase, null, 2)}</pre>
    </div>
  );
}

export default Success;