import styles from "./Item.module.css"
import axios from "axios";
import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import Choice from "../Choice/Choice"
import spinner from "../../../public/brandlogo.png"
import { AuthContext } from "../AuthContext";

const USERNAME = import.meta.env.VITE_API_USERNAME;
const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Item({ name, productId }) {

    const fileInputRef = useRef(null);
    const sendRef = useRef(null);
    const reviewRef = useRef(null);
    const propertiesRef = useRef(null);
    const similarRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);
    const [hoverId, setHoverId] = useState(0);
    const { account, logout, token } = useContext(AuthContext);
    const [item, setItem] = useState([]);
    const [repliedAccount, setRepliedAccount] = useState("")
    const [repliedComment, setRepliedComment] = useState();
    const [repliedCommentText, setRepliedCommentText] = useState("");
    const [similarItems, setSimilarItems] = useState([]);
    const [isChoice, setIsChoice] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isFixed, setIsFixed] = useState(true);
    const [firstPart, setFirstPart] = useState("");
    const [secondPart, setSecondPart] = useState("");
    const [showAllProps, setShowAllProps] = useState(false);
    const [newCommentText, setnewCommentText] = useState("");
    const textareaRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [openReplies, setOpenReplies] = useState({});
    const [repliesByCommentId, setRepliesByCommentId] = useState({});
    const [isSending, setIsSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
    const [showRatingStars, setShowRatingStars] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const changeCart = {
        id: null,
        account: {},
        products: [],
        totalPrice: 0,
        amounts: {}
    };

    const [cart, setCart] = useState(changeCart);

    const isInCart = cart?.products?.some(product => product.id === item.id);

    const fetchRepliesByIds = async (repliesId) => {
        if (!repliesId || repliesId.length === 0) return [];
        try {
            const responses = await Promise.all(
                repliesId.map((id) =>
                    axios.get(`https://techstore-3fvk.onrender.com/api/v1/comments/${id}`, {

                    })
                )
            );
            return responses.map((res) => res.data);
        } catch (err) {
            console.error("Error fetching replies:", err);
            return [];
        }
    };


    useEffect(() => {
        if (!item) return;

        const fetchComments = async () => {

            try {
                const response = await axios.get(
                    `https://techstore-3fvk.onrender.com/api/v1/comments/product`,
                    {
                        params: { productId },



                    }
                );
                setComments(response.data);

            } catch (err) {
                console.error("Error fetching comments:", err);
            } finally {
            }
        };

        fetchComments();
    }, [item]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountResponse = await axios.get(
                    `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${account.username}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const logAccount = accountResponse.data;

                const cartResponse = await axios.get(
                    `https://techstore-3fvk.onrender.com/api/v1/carts/account/${logAccount.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setCart(cartResponse.data);
            } catch (err) {
                console.error("Error fetching account or cart:", err);
            }
        };

        if (account?.username) {
            fetchData();
        }
    }, [account]);


    const handleChange = (e) => {
        setnewCommentText(e.target.value);

        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    };



    useEffect(() => {
        if (!item?.longDescription) return;

        const text = item.longDescription;
        const half = Math.floor(text.length / 2);

        let splitIndex = text.indexOf(".", half);
        if (splitIndex === -1) splitIndex = half;

        setFirstPart(text.slice(0, splitIndex + 1).trim());
        setSecondPart(text.slice(splitIndex + 1).trim());
    }, [item]);


    useEffect(() => {
        const handleScroll = () => {
            const targetRem = 42;
            const targetPx = targetRem * parseFloat(getComputedStyle(document.documentElement).fontSize);

            if (window.scrollY < targetPx) {
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
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        }
    };





    useEffect(() => {
        setIsChoice(false);
    }, [name]);

    useEffect(() => {
        if (!name) return;
        axios.get(`https://techstore-3fvk.onrender.com/api/v1/products/name/${name}`,

        )
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








    const sendComment = async () => {
        if (!newCommentText.trim()) {
            setWarningMessage("Comment cannot be empty!");
            return;
        }

        if (!repliedAccount && !selectedRating) {
            setWarningMessage("Please select a rating before sending a comment.");
            return;
        }

        setWarningMessage("");
        setIsSending(true);

        try {
            if (repliedAccount) {
                await axios.post(
                    `https://techstore-3fvk.onrender.com/api/v1/comments/reply/${repliedComment}/${account.username}/${repliedAccount}`,
                    null,
                    {
                        params: { productId: item.id, comment: newCommentText },
                    }
                );
            } else {
                await axios.post(
                    `https://techstore-3fvk.onrender.com/api/v1/comments/comment/${item.account.username}`,
                    null,
                    {
                        params: { productId: item.id, comment: newCommentText, rate: selectedRating },
                    }
                );

                await axios.put(
                    `https://techstore-3fvk.onrender.com/api/v1/products/update/rating/${item.id}`,
                    null,
                    { params: { rating: selectedRating } }
                );
            }

            const updatedItem = await axios.get(
                `https://techstore-3fvk.onrender.com/api/v1/products/id/${item.id}`,
            );

            setItem(updatedItem.data);
            setSuccessMessage("Comment sent successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
            setnewCommentText("");
            setRepliedAccount("");
            setRepliedComment();
            setSelectedRating(0);
            setShowRatingStars(false);

        } catch (error) {
            console.error(error);
            setWarningMessage("Failed to post comment.");
        } finally {
            setIsSending(false);
        }
    };


    const handleLike = async (commentId) => {
        if (!account?.username) {
            alert("You must be logged in to like a comment.");
            return;
        }

        try {
            const response = await axios.post(
                "https://techstore-3fvk.onrender.com/api/v1/comments/like",
                null,
                {
                    params: {
                        commentId: commentId,
                        username: account.username
                    }
                }
            );

            const updatedComment = response.data;

            setComments(prevComments => {
                return prevComments.map(comment => {
                    if (comment.id === updatedComment.id) {
                        return updatedComment;
                    }

                    if (comment.replies && comment.replies.length > 0) {
                        return {
                            ...comment,
                            replies: comment.replies.map(reply => {
                                if (reply.id === updatedComment.id) {
                                    return {
                                        id: updatedComment.id,
                                        comment: updatedComment.comment,
                                        fromAccount: updatedComment.fromAccount,
                                        likes: updatedComment.likes,
                                        likedBy: updatedComment.likedBy,
                                        toAccount: updatedComment.toAccount,
                                        repliedCommentId: updatedComment.repliedComment?.id,
                                        repliedUsername: updatedComment.repliedUsername,
                                        rate: updatedComment.rate,
                                        productId: updatedComment.product.id,
                                        repliesId: updatedComment.replies?.map(r => r.id) || []
                                    };
                                }
                                return reply;
                            })
                        };
                    }

                    return comment;
                });
            });

        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    const [count, setCount] = useState(0);

    useEffect(() => {
        if (cart && cart.amounts && item?.id in cart.amounts) {
            setCount(cart.amounts[item.id]);
        } else {
            setCount(0);
        }
    }, [cart, item]);



    const increase = () => { setCount(count + 1) };

    const decrease = () => { setCount(count == 0 ? 0 : count - 1) };

    const addCart = async () => {
        if (!cart || !item) return;

        const currentAmount = cart.amounts[item.id] || 0;
        const difference = count - currentAmount;

        if (difference === 0) return;

        setIsAdding(true);

        const endpoint =
            difference > 0
                ? `https://techstore-3fvk.onrender.com/api/v1/carts/add/product/${cart.id}`
                : `https://techstore-3fvk.onrender.com/api/v1/carts/remove/product/${cart.id}`;

        try {
            const response = await axios.put(
                endpoint,
                {},
                {
                    params: {
                        productId: item.id,
                        productAmount: Math.abs(difference),
                    },

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },


                }
            );

            setCart(response.data);
            setSuccessMessage("Your cart has been updated!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Cart update failed:", err);
        } finally {
            setIsAdding(false);
        }
    };











    useEffect(() => {
        if (!item?.category) return;

        axios.get("https://techstore-3fvk.onrender.com/api/v1/products/all",

        )
            .then(response => {
                const filtered = response.data.filter(i => i.category === item.category && i.name !== item.name)
                    .slice(0, 5);
                setSimilarItems(filtered);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [item]);


    const discount = item.discount
        ? (item.price * (100 - item.discount) / 100).toFixed(2)
        : null;

    return (item.productImageUrl && cart.id) ? (<>

        <p className={styles.success} style={{ top: successMessage ? "5.15rem" : "-1rem" }}>{successMessage}</p>


        {isChoice ? <Choice item={item} setIsChoice={setIsChoice} /> : null}
        <div className={styles.container}>
            <div className={styles.item} style={{
                position: isFixed ? "fixed" : "absolute",
                transform: isFixed ? "translate(-120.5%, 14.2%)" : "translate(-120.5%, 47.5rem)"
            }}>
                <img className={styles.image} src={item.productImageUrl} alt={item.name} />
                <p className={styles.amount}>Only {item.amount} left!</p>
                <Link className={styles.itemAccount}>
                    <Link className={styles.accountPreview} to={`/account/${item.account.username}`}>
                        <div className={styles.accountNameDiv}>
                            <img className={styles.accountPreviewPicture} src={item.account.profilePictureUrl} alt="" />
                            <p className={styles.accountPreviewName}>{item.account.customerName}</p>
                            <p className={styles.accountPreviewUsername}>@{item.account.username}</p>
                        </div>
                        <div className={styles.accountDescriptionDiv}>
                            <p className={styles.accountPreviewDescription}>{item.account.description}</p>
                        </div>
                    </Link>
                    <img src={item.account.profilePictureUrl} alt="" />
                    <p className={styles.accountPosted}>Posted By</p>
                    <p className={styles.accountName}>{item.account.customerName}</p>
                    <Link className={styles.accountView} to={`/account/${item.account.username}`}>View Profile</Link>

                </Link>
                <div className={styles.options}>
                    <button className={styles.propertiesButton} onClick={() => {
                        if (propertiesRef.current) {
                            const yOffset = -120;
                            const y =
                                propertiesRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

                            window.scrollTo({ top: y, behavior: "smooth" });
                        }
                    }}>Properties</button>
                    <button className={styles.reviewsButton} onClick={() => {
                        if (reviewRef.current) {
                            const yOffset = -120;
                            const y =
                                reviewRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

                            window.scrollTo({ top: y, behavior: "smooth" });
                        }
                    }}>Reviews</button>
                    <button className={styles.similarButton} onClick={() => {
                        if (similarRef.current) {
                            const yOffset = -120;
                            const y =
                                similarRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

                            window.scrollTo({ top: y, behavior: "smooth" });
                        }
                    }}>Similar Items</button>
                </div>
            </div>

            <div className={styles.itemMainContainer}>


                <div className={styles.itemDescription}>
                    <div className={styles.itemGeneral}>
                        <p className={styles.company}>{item.company}</p>
                        <p className={styles.name}>{item.name}</p>
                        <p className={styles.description}>{item.description}</p>
                    </div>

                    <div className={styles.ratingGeneral}>
                        <p className={styles.rating}>Rating: {item.rating}/5.0</p>
                        <div className={styles.ratingLine} style={{ width: `${item.rating * 3.8}rem` }}></div>
                        <div className={styles.overallRating}></div>
                        <button className={styles.check} onClick={() => {
                            if (reviewRef.current) {
                                const yOffset = -120;
                                const y =
                                    reviewRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

                                window.scrollTo({ top: y, behavior: "smooth" });
                            }
                        }}>Check reviews</button>
                    </div>

                    <div className={styles.priceGeneral}>
                        <p className={discount ? styles.discounted : styles.price}>{item.price}₼</p>
                        {discount && (
                            <>
                                <p className={styles.discount}>{item.discount}%</p>
                                <p className={styles.discountedPrice}>{discount}₼</p>
                            </>
                        )
                        }

                        <button className={styles.buy} onClick={buy}>Buy now</button>
                        <p className={styles.number}>{count}</p>
                        {cart.amounts[item.id] != 0 && cart.amounts[item.id] ? (<>
                            <Link className={styles.added} to={`/account/${account.username}/cart`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                                </svg>
                            </Link>
                        </>) : (<>

                        </>)

                        }
                        <button className={styles.decrease} onClick={decrease} style={styles.button}>-</button>
                        <div className={styles.addedNumber}>
                            <p>{cart.amounts[item.id]}</p>
                        </div>
                        <button className={styles.increase} onClick={increase} style={styles.button}>+</button>
                        <button className={styles.cart} onClick={addCart}
                            style={{ left: cart.amounts[item.id] != 0 && cart.amounts[item.id] ? "22.93rem" : "23.3rem" }}>{cart.amounts[item.id] != 0 && cart.amounts[item.id] ? "Update Cart" : "Add to cart"}</button>
                        {isAdding ? (
                            <>
                                <div className={styles.cartSpinnerDiv}>
                                    <div className={styles.spinner}></div>
                                </div>
                            </>
                        ) : (<></>
                        )}
                        <button className={styles.favourite}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" /></svg>
                        </button>
                    </div>

                    <div className={styles.longDescriptionGeneral}>
                        <p className={styles.about}>About</p>
                        <p className={styles.productLongDescriptionFirst}>{firstPart}</p>
                        {item.videoUrl && (
                            <div className={styles.itemVideo}>
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
                            </div>
                        )}

                        <p className={styles.productLongDescriptionSecond}>{secondPart}</p>
                    </div>


                </div>
            </div>



            <div className={styles.whiteCover}></div>
            <p className={styles.propertiesTitle}>Properties</p>
            <div className={styles.properties} ref={propertiesRef}>
                {(() => {
                    const extraFields = {
                        Weight: item.weight,
                        Height: item.height,
                        Volume: item.volume,
                        Width: item.width,
                        Guarantee: item.guarantee
                    };

                    const allProps = { ...item.properties, ...extraFields };
                    const entries = Object.entries(allProps).filter(([_, value]) => value);

                    const visibleProps = showAllProps ? entries : entries.slice(0, 12);

                    return (
                        <>
                            {visibleProps.map(([key, value]) => {
                                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                                return (
                                    <div key={key} className={styles.property}>
                                        <p style={{ fontFamily: "PoppinsRegular", color: "Gray" }}>{formattedKey}</p>
                                        <p style={{ fontFamily: "PoppinsMedium" }}>{value}</p>
                                    </div>
                                );
                            })}

                            {entries.length > 12 && (
                                <button
                                    className={styles.showMoreBtn}
                                    onClick={() => setShowAllProps(!showAllProps)}
                                >
                                    {showAllProps ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </>
                    );
                })()}
            </div>
            <div className={styles.review} ref={reviewRef}>
                <p className={styles.reviewTitle}>Reviews({item.comments.length})</p>
                <div className={styles.commentBox}>
                    {comments?.length > 0 ? (
                        <>

                            {comments
                                .filter((comment) => !comment?.toAccount)
                                .slice(0, visibleCommentsCount)
                                .map((comment) => (
                                    <>
                                        <div key={comment?.id} className={styles.comment}>

                                            {comment?.fromAccount && (
                                                <div className={styles.accountInfo}>
                                                    <img src={comment?.fromAccount.profilePictureUrl} alt="" />
                                                    <p className={styles.commentCustomerName}>{comment?.fromAccount.customerName}</p>
                                                    <div className={styles.commentRate}>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                className={`${styles.star} ${star <= Number(comment.rate) ? styles.filled : ""}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <p className={styles.commentText}>{comment?.comment}</p>
                                            <div className={styles.likeDiv}>
                                                <p className={styles.likeCount}>{comment?.likes ? comment?.likes : 0}</p>
                                                <button className={styles.like} onClick={() => handleLike(comment?.id)}
                                                    style={{ backgroundColor: (comment?.likedBy || []).includes(account.username) ? "rgb(112, 139, 255)" : "", color: (comment?.likedBy || []).includes(account.username) ? "white" : "rgb(82, 82, 82)" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        height="24px"
                                                        viewBox="0 -960 960 960" width="24px" fill={(comment?.likedBy || []).includes(account.username) ? "white" : "rgb(82, 82, 82)"}><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                                                    </svg>
                                                </button>
                                                <button className={styles.reply}
                                                    onClick={() => {
                                                        setRepliedAccount(comment?.fromAccount.username);
                                                        setRepliedComment(comment?.id);
                                                        setRepliedCommentText(comment?.comment);
                                                        if (sendRef.current) {
                                                            const yOffset = -120;
                                                            const y =
                                                                sendRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

                                                            window.scrollTo({ top: y, behavior: "smooth" });
                                                        }
                                                    }}>Reply</button>
                                            </div>
                                        </div>
                                        {comment?.replies?.length > 0 && (
                                            <>
                                                <button className={styles.showReplies} onClick={() =>
                                                    setOpenReplies((prev) => ({
                                                        ...prev,
                                                        [comment.id]: !prev[comment.id]
                                                    }))
                                                }>
                                                    ──────── {openReplies[comment.id] ? "Close" : "Show"} {comment.replies.length} Replies ────────</button>

                                                {openReplies[comment.id] && (
                                                    <div className={styles.replies}>

                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className={styles.replyComment}>
                                                                {reply.fromAccount && (
                                                                    <div className={styles.accountReplyInfo}>
                                                                        <img src={reply.fromAccount.profilePictureUrl} alt="" />
                                                                        <p className={styles.replyCustomerName}>{reply.fromAccount.customerName}</p>
                                                                        <p className={styles.repliedTo}> Replied to {reply.toAccount.customerName}</p>
                                                                    </div>
                                                                )}
                                                                <p className={styles.replyText}>{reply.comment}</p>
                                                                <div className={styles.likeReplyDiv}>
                                                                    <p className={styles.replyLikeCount}>{reply.likes ? reply.likes : 0}</p>
                                                                    <button className={styles.replyLike} onClick={() => handleLike(reply.id)}
                                                                        style={{ backgroundColor: (reply.likedBy || []).includes(account.username) ? "rgb(112, 139, 255)" : "", color: (reply.likedBy || []).includes(account.username) ? "white" : "rgb(82, 82, 82)" }}
                                                                    >

                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                            height="20px"
                                                                            viewBox="0 -960 960 960" width="20px" fill={(reply.likedBy || []).includes(account.username) ? "white" : "rgb(82, 82, 82)"}><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button className={styles.replyReply} onClick={() => {
                                                                        setRepliedAccount(reply.fromAccount.username);
                                                                        setRepliedComment(comment.id);
                                                                        setRepliedCommentText(reply.comment);
                                                                        if (sendRef.current) {
                                                                            const yOffset = -120;
                                                                            const y =
                                                                                sendRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

                                                                            window.scrollTo({ top: y, behavior: "smooth" });
                                                                        }
                                                                    }}>Reply</button>
                                                                </div>
                                                            </div>

                                                        ))}

                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                ))}
                            {visibleCommentsCount < comments?.filter(comment => !comment?.toAccount).length && (
                                <button
                                    className={styles.showMoreComments}
                                    onClick={() => setVisibleCommentsCount(prev => prev + 10)}
                                >
                                    ──────── Show more comments ────────
                                </button>
                            )}
                        </>
                    ) : (
                        <>

                            <p className={styles.reviewSubTitle}>Be the first to leave a comment!</p>
                        </>
                    )}
                    <div className={styles.send} ref={sendRef}>
                        {repliedAccount && repliedComment && (<>
                            <p className={styles.replySend}>Replying to @{repliedAccount}</p>
                            <p className={styles.replyCommentSend}>{repliedCommentText}</p>
                            <button className={styles.cancelReply} onClick={() => {
                                setRepliedAccount(null);
                                setRepliedComment(null);
                            }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </svg>
                            </button>
                        </>)}

                        <textarea className={styles.input}
                            ref={textareaRef}
                            value={newCommentText}
                            onChange={handleChange}
                            placeholder="Write a comment..."
                            rows={1}
                        />
                        {isSending ? (
                            <>
                                <div className={styles.spinnerDiv}>
                                    <div className={styles.spinner}></div>
                                </div>
                            </>
                        ) : (

                            <button className={styles.post} onClick={sendComment} disabled={isSending}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    height="27px" viewBox="0 -960 960 960" width="27px" fill="#ffffffff">
                                    <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                                </svg>
                                <p className={styles.postTitle}>Send</p>
                            </button>

                        )}

                        <button className={styles.rate}
                            style={{
                                paddingRight: showRatingStars ? "6.5rem" : "1.3rem",
                                borderRadius: showRatingStars ? "2rem" : "1.3rem",
                            }}
                            onClick={() => setShowRatingStars(prev => !prev)}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                height="27px"
                                viewBox="0 -960 960 960"
                                width="27px"
                                fill="#ffffffff"
                                style={{ left: showRatingStars ? "30%" : "50%" }}>
                                <path d="m305-704 112-145q12-16 28.5-23.5T480-880q18 0 34.5 7.5T543-849l112 145 170 57q26 8 41 29.5t15 47.5q0 12-3.5 24T866-523L756-367l4 164q1 35-23 59t-56 24q-2 0-22-3l-179-50-179 50q-5 2-11 2.5t-11 .5q-32 0-56-24t-23-59l4-165L95-523q-8-11-11.5-23T80-570q0-25 14.5-46.5T135-647l170-57Zm49 69-194 64 124 179-4 191 200-55 200 56-4-192 124-177-194-66-126-165-126 165Zm126 135Z" />
                            </svg>
                            <p className={styles.rateTitle}>Rate</p>
                        </button>
                        {showRatingStars && (
                            <div className={styles.starsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setSelectedRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "24px",
                                            color: star <= (hoverRating || selectedRating) ? "#f3615cff" : "#ccc"
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        )}
                        {warningMessage && <p className={styles.warningMessage}>{warningMessage}</p>}
                    </div>

                </div>

            </div>
            <div className={styles.similar} ref={similarRef}>
                <p className={styles.similarTitle}>Check similar items</p>
                <ul className={styles.similarItems}>
                    {similarItems.map((i) => (
                        <Link className={styles.similarItem} to={"/product/" + i.id}>
                            <div className={styles.info}>
                                <img src={i.productImageUrl} alt={i.name} />
                            </div>
                            <p className={styles.nameOf}>{i.name}</p>
                            <p className={styles.guaranteeTitle}>Guarantee</p>
                            <p className={styles.guarantee}>{i.guarantee ?? 0} month</p>
                            <p className={styles.availTitle}>Available</p>
                            <p className={styles.avail}>{i.amount}</p>
                            <p className={styles.priceTitle}>Price</p>
                            <p className={styles.priceOf}>{i.price ?? 0}₼</p>
                            <button className={styles.cartOf}
                                onMouseEnter={() => { setIsHovered(true); setHoverId(i.id) }}
                                onMouseLeave={() => { setIsHovered(false); setHoverId(0) }}>
                                <p className={styles.cartText} style={{ opacity: isHovered && hoverId == i.id ? "1" : "0" }}>Add to Cart</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                                </svg>
                            </button>
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