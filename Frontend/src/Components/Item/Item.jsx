import styles from "./Item.module.css"
import axios from "axios";
import { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import Choice from "../Choice/Choice"
import spinner from "../../../public/brandlogo.png"

function Item({name}) {

    const fileInputRef = useRef(null);

    const [item,setItem] = useState([]);
    const [similarItems,setSimilarItems] = useState([]);
    const [isChoice,setIsChoice] = useState(false);

    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(item.videoUrl || "");

 const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

  try {
    const res = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductVideo",
        formData
    );

    const uploadedUrl = res.data.url;
    console.log("Uploaded video URL:", uploadedUrl);

    const updatedProduct = { ...item, videoUrl: uploadedUrl };
    await axios.put(
        "https://techstore-3fvk.onrender.com/api/v1/products/update",
        updatedProduct
    );

    setVideoUrl(uploadedUrl);
    setItem(updatedProduct);
    alert("Video uploaded & saved!");
    } catch (err) {
      
    }
    };

    const uploadVideo = async () => {
  if (!videoFile) return;

  const formData = new FormData();
    formData.append("file", videoFile);

    try {
        // Upload video file
        const res = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductVideo",
        formData
        );
        console.log(videoFile);
        const uploadedUrl = res.data.url;

        // Update product in DB
        const updatedProduct = { ...item, videoUrl: uploadedUrl };
        await axios.put(
        "https://techstore-3fvk.onrender.com/api/v1/products/update",
        updatedProduct
        );

        // Update React state
        setVideoUrl(uploadedUrl);
        setItem(updatedProduct);

        alert("Video uploaded & saved!");
    } catch (err) {
        console.error(err);
        alert("Error uploading video");
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

    const buy = function() {
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
    { isChoice ? <Choice item={item} setIsChoice={setIsChoice} /> : null }
    <div className={styles.container}>
        <div className={styles.item} 
            style={{ backgroundColor: "rgb(245, 245, 245)" }}>
            <img className={styles.image} src={item.productImageUrl} alt={item.name} />
            <p className={styles.amount}>Only {item.amount} left!</p>
        </div>
        <div className={styles.itemDescription}>
            <p className={styles.company}>{item.company}</p>
            <p className={styles.name}>{item.name}</p>
            <p className={styles.description}>{item.description}</p>
            <p className={styles.guarantee}><u>Guarantee of {item.guarantee} month</u></p>
            <p className={discount ? styles.discounted : styles.price}>{item.price}₼</p>
            <p className={styles.rating}>Rating: {item.rating}/5.0</p>
            <div className={styles.ratingLine} style={{width:`${item.rating*2.8}rem`}}></div>
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
            <button className={styles.favourite}>Add to favourites</button>
        </div>
        <div className={styles.videoSection}>
        <input
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        />

        {/* Button triggers file input, then uploads automatically */}
        <button
        className={styles.uploadButton}
        onClick={() => {
            fileInputRef.current.click();
        }}
        >
        {videoUrl ? "Replace Video" : "Upload Video"}
        </button>

        {/* Optional: automatically upload after selecting file */}
        {videoFile && (
        <button className={styles.uploadButton} onClick={uploadVideo}>
            Save Video
        </button>
        )}
          {videoUrl && (
                <video
                src={videoUrl}
                controls
                width="100%"
                style={{ marginTop: "1rem", borderRadius: "1rem" }}
                />
            )}
        </div>

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
                    <p style={{fontFamily:"PoppinsSemiBold"}}>{formattedKey}</p>
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
                    to= {"/product/" + i.id}
                    style={{ backgroundColor: "rgb(245, 245, 245)" }}>
                        <img src={i.productImageUrl} alt={i.name} />
                        <p className={styles.itemName}>{i.name}</p>
                        <p className={styles.guarantee}>{i.guarantee} month</p>
                        {i.discount && (
                        <>
                            <p className={styles.itemDiscount}>{i.discount}%</p>
                            <div className={styles.itemLine} style={{width:`${i.price.toString().length}rem`,right: `${(10/i.price.toString().length)+0.8}rem`}}></div>
                            <p className={styles.itemDiscountedPrice}>{(i.price * (100 - i.discount) / 100).toFixed(2)}₼</p>
                        </>
                        )
                        }
                        <span className={i.discount ? styles.itemNew : styles.itemOld}><b>{i.price}₼</b></span>
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