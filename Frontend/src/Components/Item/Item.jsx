import styles from "./Item.module.css"
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Choice from "../Choice/Choice"
import spinner from "../../../public/brandlogo.png"

function Item({ name }) {

    const fileInputRef = useRef(null);

    const [item, setItem] = useState([]);
    const [similarItems, setSimilarItems] = useState([]);
    const [isChoice, setIsChoice] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const halfPage = document.body.scrollHeight / 14.1;

            if (window.scrollY < halfPage) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen(); // Safari
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen(); // IE11
            }
        }
    };


    useEffect(() => {
        setIsChoice(false);
    }, [name]);

    useEffect(() => {
        if (!name) return;
        axios.get(`https://techstore-3fvk.onrender.com/api/v1/products/name/${name}`)
            .then(response => {
                setItem(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [name]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [name]);

    const buy = function () {
        setIsChoice(!isChoice);
    }


    useEffect(() => {
        if (!item?.category) return;

        axios.get("https://techstore-3fvk.onrender.com/api/v1/products/all")
            .then(response => {
                const filtered = response.data.filter(i => i.category === item.category && i.name !== item.name)
                    .slice(0, 4);
                setSimilarItems(filtered);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [item]);


    const discount = item.discount
        ? (item.price * (100 - item.discount) / 100).toFixed(2)
        : null;

    return item.productImageUrl ? (<>
        {isChoice ? <Choice item={item} setIsChoice={setIsChoice} /> : null}
        <div className={styles.container}>
            {/* <div className={styles.itemVideo}>
                <video
                    src={item.videoUrl}
                    muted
                    controls={showControls}
                    autoPlay
                    loop
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                    onClick={handleClick}
                />
                <p className={styles.videoText}>Double Click to Watch the Video</p>
    </div> */}
            <div className={styles.item} style={{
                position: isFixed ? "fixed" : "absolute",
                transform: isFixed ? "translate(-120.5%, 22%)" : "translate(-120.5%, 61.77%)"
            }}>
                <img className={styles.image} src={item.productImageUrl} alt={item.name} />
                <p className={styles.amount}>Only {item.amount} left!</p>
            </div>
            <div className={styles.itemMainContainer}>


                <div className={styles.itemDescription}>
                    <p className={styles.company}>{item.company}</p>
                    <p className={styles.name}>{item.name}</p>
                    <p className={styles.description}>{item.description}</p>
                    <p className={discount ? styles.discounted : styles.price}>{item.price}₼</p>
                    <p className={styles.rating}>Rating: {item.rating}/5.0</p>
                    <div className={styles.ratingLine} style={{ width: `${item.rating * 3.8}rem` }}></div>
                    <div className={styles.overallRating}></div>
                    <button className={styles.check}>Check reviews</button>
                    {discount && (
                        <>
                            <p className={styles.discount}>{item.discount}%</p>
                            <div className={styles.line}></div>
                            <p className={styles.discountedPrice}>{discount}₼</p>
                        </>
                    )
                    }
                    <button className={styles.buy} onClick={buy}>Buy now</button>
                    <button className={styles.cart}>Add to cart</button>
                    <button className={styles.favourite}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" /></svg>
                    </button>
                </div>
            </div>

            <Link className={styles.itemAccount}>
                <img src={item.account.profilePictureUrl} alt="" />
                <p className={styles.accountName}>{item.account.customerName}</p>
                <p className={styles.accountUsername}>@{item.account.username}</p>
            </Link>

            <div className={styles.whiteCover}></div>
            <p className={styles.propertiesTitle}>Properties</p>
            <div className={styles.properties}>

                {(() => {
                    const extraFields = {
                        Weight: item.weight,
                        Height: item.height,
                        Volume: item.volume,
                        Width: item.width,
                        Guarantee: item.guarantee
                    };

                    const allProps = { ...item.properties, ...extraFields };

                    return (
                        allProps &&
                        Object.entries(allProps).map(([key, value]) => {
                            if (!value) return null;
                            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <div key={key} className={styles.property}>
                                    <p style={{ fontFamily: "PoppinsSemiBold" }}>{formattedKey}</p>
                                    <span>{value}</span>
                                </div>
                            );
                        })
                    );
                })()}
            </div>
            <div className={styles.review}>
                <p className={styles.reviewTitle}>Reviews</p>

            </div>
            <div className={styles.similar}>
                <p className={styles.similarTitle}>Check similar items</p>
                <ul className={styles.items}>
                    {similarItems.map((i) => (
                        <Link key={i.id} className={styles.similarItem}
                            to={"/product/" + i.id}
                        >
                            <img src={i.productImageUrl} alt={i.name} />
                            <p className={styles.itemName}>{i.name}</p>
                            <p className={styles.guarantee}>{i.guarantee} month</p>
                            {i.discount ? (
                                <>
                                    <div className={styles.priceContainer}>
                                        <p className={styles.itemDiscount}>{i.discount}%</p>
                                        <span className={styles.itemNew}>{i.price}₼</span>
                                    </div>
                                    <div className={styles.itemLine} style={{ width: `${i.price.toString().length}rem`, right: `${(10 / i.price.toString().length) + 0.8}rem` }}></div>
                                    <p className={styles.itemDiscountedPrice}>{(i.price * (100 - i.discount) / 100).toFixed(2)}₼</p>
                                </>
                            ) : (<span className={styles.itemOld}>{i.price}₼</span>)
                            }

                        </Link>
                    ))}
                </ul>
            </div>
        </div>

    </>) : (
        <div className={styles.loadingContainer}>
            <img src={spinner} alt="Loading..." className={styles.loadingImage} />
        </div>
    )
}


export default Item;