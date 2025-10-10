import axios from "axios";
import styles from "./Cart.module.css"
import { AuthContext } from "../AuthContext";
import { useContext, useEffect, useState } from "react";
import spinner from "../../../public/brandlogo.png"
import { Link } from "react-router-dom";

const USERNAME = import.meta.env.VITE_API_USERNAME;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Cart({cart,setCart}) {

    const { account, logout } = useContext(AuthContext);
    const [count, setCount] = useState(0);
    const [isAdding, setIsAdding] = useState(false);


 

    return (cart && cart.id) ? (
    <>
        <div className={styles.container}>
            <div className={styles.div}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
                <div className={styles.titleDiv}>
                    <p className={styles.title}>Shopping Cart</p>
                    <p className={styles.count}>{cart.products.length + (cart.products.length<=1 ? " Item" : " Items") }</p>
                </div>
                <div className={styles.cartDiv}>
                {cart.products.map(product => {
                const count = cart.amounts?.[product.id] || 0;

                const addCart = async (updatedCart, productId, newAmount) => {
                setIsAdding(true);
                if (cart.amounts[product.id] < count  || !cart.amounts[product.id]) {
                    try {
                        const response = await axios.put(
                            `https://techstore-3fvk.onrender.com/api/v1/carts/add/product/${cart?.id}`,
                            {},
                            {
                                params: {
                                    productId: product.id,
                                    productAmount: count,
                                },
                                auth: {
                                    username: USERNAME,
                                    password: PASSWORD,
                                },
                            }
                        );

                        setCart(response.data);
                    } catch (err) {
                        console.error(err);
                    }
                }

                else if (cart.amounts[product.id] > count) {
                    try {
                        const response = await axios.put(
                            `https://techstore-3fvk.onrender.com/api/v1/carts/remove/product/${cart?.id}`,
                            {},
                            {
                                params: {
                                    productId: product.id,
                                    productAmount: (cart.amounts[product.id]-count),
                                },
                                auth: {
                                    username: USERNAME,
                                    password: PASSWORD,
                                },
                            }
                        );

                        setCart(response.data);
                    
                    } catch (err) {
                        console.error(err);
                    }
                }
                setIsAdding(false);
                setTimeout(() => {
                }, 3000);
            };

                const increase = () => {
                setCart(prev => {
                    const newAmount = (prev.amounts?.[product.id] || 0) + 1;
                    const updatedCart = {
                    ...prev,
                    amounts: {
                        ...prev.amounts,
                        [product.id]: newAmount,
                    },
                    };

                    addCart(updatedCart, product.id, newAmount);
                    return updatedCart;
                });
                };

                const decrease = () => {
                    setCart(prev => {
                        const newAmount = Math.max((prev.amounts?.[product.id] || 0) - 1, 0);
                        const updatedCart = {
                        ...prev,
                        amounts: {
                            ...prev.amounts,
                            [product.id]: newAmount,
                        },
                        };

                        addCart(updatedCart, product.id, newAmount);
                        return updatedCart;
                    });
                };

                return (
                    <div key={product.id} className={styles.productDiv}>
                    <Link to={"/product/" + product.id}>
                        <img className={styles.productImage} src={product.productImageUrl} alt="" />
                        <div className={styles.generalInfo}>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productSeller}>Seller: {product.account.customerName}</p>
                        </div>
                    </Link>

                    <div className={styles.controls}>
                        <button onClick={decrease} className={styles.decrease}>-</button>
                        <p className={styles.number}>{count}</p>
                        <button onClick={increase} className={styles.increase}>+</button>
                    </div>

                    </div>
                );
                })}
                </div>
            </div>
        </div>
        </>
    ) : (<>
     <div className={styles.loadingContainer}>
        <img src={spinner} alt="Loading..." className={styles.loadingImage} />
    </div>
    </>);
}

export default Cart;