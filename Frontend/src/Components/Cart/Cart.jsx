import axios from "axios";
import styles from "./Cart.module.css";
import { AuthContext } from "../AuthContext";
import { useContext, useEffect, useState } from "react";
import spinner from "../../../public/brandlogo.png";
import { Link } from "react-router-dom";
import Samsungs from "../../assets/samsungs.png"

const USERNAME = import.meta.env.VITE_API_USERNAME;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Cart({ cart, setCart }) {
  const { account, logout, token } = useContext(AuthContext);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    if (!pendingUpdate) return;

    const { productId, newAmount, oldAmount } = pendingUpdate;

    const updateCartBackend = async () => {
      try {
        const isIncrease = newAmount > oldAmount;
        const endpoint = isIncrease
          ? `https://techstore-3fvk.onrender.com/api/v1/carts/add/product/${cart?.id}`
          : `https://techstore-3fvk.onrender.com/api/v1/carts/remove/product/${cart?.id}`;

        const response = await axios.put(
          endpoint,
          {},
          {
            params: {
              productId,
              productAmount: Math.abs(newAmount - oldAmount),
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCart(response.data);
      } catch (err) {
        console.error("Cart update failed:", err);
      } finally {
        setPendingUpdate(null);
      }
    };




    const timer = setTimeout(updateCartBackend, 200);
    return () => clearTimeout(timer);
  }, [pendingUpdate]);

  const handleIncrease = (productId) => {
    const oldAmount = cart.amounts?.[productId] || 0;
    const newAmount = oldAmount + 1;

    setCart({
      ...cart,
      amounts: { ...cart.amounts, [productId]: newAmount },
    });

    setPendingUpdate({ productId, oldAmount, newAmount });
  };


  useEffect(() => {
    if (!cart || !Array.isArray(cart.products)) return;

    let totalDiscount = 0;
    let tot = 0;

    cart.products.forEach((product) => {
      tot += (product.price * cart.amounts[product.id]);
      if (product.discount) {
        const dis = product.discount / 100;
        const discountAmount = product.price * dis * cart.amounts[product.id];
        totalDiscount += discountAmount;
      }
    });

    setDiscount(totalDiscount.toFixed(2));
    setTotal(tot.toFixed(2));
  }, [cart]);



  const handleDecrease = (productId) => {
    const oldAmount = cart.amounts?.[productId] || 0;
    const newAmount = Math.max(oldAmount - 1, 0);

    setCart({
      ...cart,
      amounts: { ...cart.amounts, [productId]: newAmount },
    });

    setPendingUpdate({ productId, oldAmount, newAmount });
  };

  if (!cart || !cart.id) {
    return (
      <div className={styles.loadingContainer}>
        <img src={spinner} alt="Loading..." className={styles.loadingImage} />
      </div>
    );
  }


  return (
    <div className={styles.container}
    style={{minHeight: cart.products.length > 0 ? "55vh" : "36.9vw",}}>
      <div className={styles.div} style={{
        top: cart.products.length > 0 ? "-4.9rem" : "-2rem",
        position: cart.products.length > 0 ? "relative" : "fixed",
        minHeight: cart.products.length > 0 ? "49.2vw" : "36.9vw",
        paddingBottom: cart.products.length > 0 ? "0rem" : "0rem",
        left: cart.products.length > 0 ? "0rem" : "50%",
        transform : cart.products.length > 0 ? "translate(1%, 10%)" : "translate(-32.3%,10%)"

      }}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.titleDiv}>
          <p className={styles.title}>Shopping Cart</p>
          <p className={styles.count}>
            {cart.products.length +
              (cart.products.length <= 1 ? " Item" : " Items")}
          </p>

        </div>

        <div className={styles.cartDiv}>
          {cart.products.length > 0 ? (
            <>
              <p className={styles.productDetailsTitle}>Product Details</p>
              <p className={styles.productQuantityTitle}>Quantity</p>
              <p className={styles.productPriceTitle}>Price</p>
              <p className={styles.productTotalTitle}>Total</p>
              {cart.products.map((product) => {
                const count = cart.amounts?.[product.id] || 0;
                return (
                  <div key={product.id} className={styles.productDiv}>
                    <Link to={`/product/${product.id}`}>
                      <img
                        className={styles.productImage}
                        src={product.productImageUrl}
                        alt=""
                      />
                      <div className={styles.generalInfo}>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productSeller}>
                          Seller: {product.account.customerName}
                        </p>
                      </div>
                      <p className={styles.productPrice}>{product.discount ? (product.price * ((100 - product.discount) / 100)).toFixed(2) : product.price.toFixed(2)}₼</p>
                      <p className={styles.productTotal}>{product.discount ? (product.price * ((100 - product.discount) / 100) * cart.amounts[product.id]).toFixed(2) : (product.price * cart.amounts[product.id]).toFixed(2)}₼</p>
                    </Link>

                    <div className={styles.controls}>
                      <button
                        onClick={() => handleDecrease(product.id)}
                        className={styles.decrease}
                        disabled={pendingUpdate}
                      >
                        -
                      </button>
                      <p className={styles.number}>{count}</p>
                      <button
                        onClick={() => handleIncrease(product.id)}
                        className={styles.increase}
                        disabled={pendingUpdate}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className={styles.totalDiv}>
                <div className={styles.summaryDiv}>
                  <p className={styles.summaryTitle}>Order Summary</p>
                  {cart.products.map((product) => (
                    <>
                      <div className={styles.orderProductDiv}>
                        <p className={styles.orderAmount}>{"x" + cart.amounts?.[product.id]}</p>
                        <p key={product.id} className={styles.orderName}>
                          {product.name}
                        </p>
                        <p className={styles.orderTotal}>{product.discount ? (product.price * ((100 - product.discount) / 100) * cart.amounts[product.id]).toFixed(2) : (product.price * cart.amounts[product.id]).toFixed(2)}₼</p>
                      </div>

                    </>

                  ))}
                </div>
                <div className={styles.discountDiv}>
                  <p className={styles.amountTitle}>Amount</p>
                  <p className={styles.amount}>{total}₼</p>
                  <p className={styles.discountTitle}>Discount</p>
                  <p className={styles.discount}>{discount}₼</p>
                </div>
                <div className={styles.orderTotalDiv}>
                  <p className={styles.totalPriceTitle}>Order Total </p>
                  <p className={styles.totalPrice}>{(cart.totalPrice).toFixed(2)}₼</p>
                </div>
                <Link className={styles.checkout}>Go Checkout</Link>
              </div>

            </>) : (<>
            <div className={styles.empty}>
                <img className={styles.samsungs} src={Samsungs} alt="" />
                <p className={styles.emptyTitle}>Your cart’s feeling a bit lonely — Let’s fix that!</p>
                <Link className={styles.emptyButton} to="/product">Shop Now</Link>
            </div>
            </>)}
        </div>


      </div>
    </div>
  );
}

export default Cart;
