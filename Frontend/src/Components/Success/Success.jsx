import { Link } from "react-router-dom";
import styles from "./Success.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";

function Success() {
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const { account, token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return; 
    const savePurchase = async () => {
      const purchaseData = sessionStorage.getItem("checkoutPayload");

            console.log("Raw checkoutPayload from sessionStorage:", purchaseData);

      if (!purchaseData) {
        
        setLoading(false);
        return;
      }

      const parsedPurchase = JSON.parse(purchaseData);
            console.log("Parsed checkoutPayload:", parsedPurchase);

      setPurchase(parsedPurchase);

      if (!token) {
        console.warn("Token not available yet — skipping purchase save.");
        setLoading(false);
        return;
      }

      try {
                console.log("Posting purchase to backend:", parsedPurchase);

        const res = await axios.post(
          "https://techstore-3fvk.onrender.com/api/v1/purchases/purchase",
          parsedPurchase,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
                console.log("Backend response for purchase save:", res.data);

      } catch (err) {
        console.error("Error saving purchase:", err.response || err);
      } finally {
        sessionStorage.removeItem("checkoutPayload");
        setLoading(false);
      }
    };

    savePurchase();
  }, [token]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading purchase details...</p>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className={styles.container}>
        <p className={styles.notTitle}>Page is not accessible</p>
        <p className={styles.notsubTitle}>Purchase information could not be found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.div}>
        <p className={styles.title}>Payment Successful!</p>
        <p className={styles.message}>
          Thank you for your purchase, <strong>{account?.username || "Customer"}</strong>!
        </p>
        <p className={styles.subMessage}>
          Your order has been successfully placed. You’ll receive a confirmation email shortly.
        </p>
        <div className={styles.actions}>
          <Link to={`/account/${account.username}/cart`} className={styles.button}>
            View Cart
          </Link>
          <Link to="/product" className={`${styles.button} ${styles.secondary}`}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Success;
