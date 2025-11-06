import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Purchase.module.css";

function Purchase({ setIsPurchaseHistory, accountId, token }) {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accountId) return;

        const fetchPurchases = async () => {
            try {
                const response = await axios.get(
                    `https://techstore-3fvk.onrender.com/api/v1/purchases/account/from/${accountId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const purchasesWithProducts = await Promise.all(
                response.data.map(async (purchase) => {
                    const products = await Promise.all(
                    (purchase.productIds || []).map(async (id) => {
                        try {
                        const res = await axios.get(
                            `https://techstore-3fvk.onrender.com/api/v1/products/id/${id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const product = res.data;
                        const quantity = purchase.quantity[id] || 1;
                        const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                        return { ...product, quantity, totalPrice: discountedPrice * quantity };
                        } catch {
                        return { id, name: `Product ${id}`, productImageUrl: "", company: "", quantity: 1, totalPrice: 0 };
                        }
                    })
                    );
                    return { ...purchase, products };
                })
                );

                setPurchases(purchasesWithProducts);
            } catch (error) {
                console.error("Failed to fetch purchases:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [accountId, token]);

    return (
        <div className={styles.containerOf}>
           <div className={styles.purchaseDiv}>
                <div className={styles.header}>
                    <p className={styles.title}>Purchase History</p>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setIsPurchaseHistory(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#ffffff"
                        >
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                    </button>
                </div>

                {loading && (
                    <p className={styles.loadingTitle}>Loading purchase history...</p>
                )}

                <div className={styles.purchaseList}>
                    {!loading && purchases.length === 0 ? (
                        <p style={{ color: "#fff" }}>No purchases found.</p>
                    ) : (
                        <ul>
                            {purchases.map((purchase) => (
                                <li key={purchase.id}>
                                    <p className={styles.code}>{purchase.purchaseCode}</p>
                                    <p className={styles.date}>
                                    {new Date(purchase.purchaseDate).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                    </p>
                                    <ul className={styles.productList}>
                                        {purchase.products.map((product) => (
                                            <li key={product.id} className={styles.productItem}>
                                            <img
                                                src={product.productImageUrl}
                                                alt={product.name}
                                                className={styles.productImage}
                                            />
                                            <div className={styles.productInfo}>
                                                <p className={styles.productName}>{product.name}</p>
                                                <p className={styles.productCompany}>{product.company}</p>
                                                <p className={styles.productQuantity}>Quantity: {product.quantity}</p>
                                                <p className={styles.productPrice}>
                                                Total: ${product.totalPrice.toFixed(2)}
                                                </p>
                                            </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className={styles.amount}>Total: {purchase.amount/100}₼</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Purchase;
