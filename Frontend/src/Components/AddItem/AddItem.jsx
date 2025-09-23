import { useState,useEffect, useRef  } from "react";
import styles from "./AddItem.module.css"
import axios from "axios";
import background from "../../assets/backgroundItem.mp4"
import Iphone from "../../assets/iphonePink.png"
import Airpods from "../../assets/airpods.png"
import Macbook from "../../assets/macbookPink.png"
import { motion } from "framer-motion";

function AddItem({highlight,setHighlight}) {

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const [videoFile, setVideoFile] = useState(null);
    const [item, setItem] = useState({});
    const [videoUrl, setVideoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState(""); 
    const [buttonActive, setButtonActive] = useState(false);
    const [isDiscount, setIsDiscount] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [newPage, setNewPage] = useState(false);
    const [lastPage, setLastPage] = useState(false);

    const categories = [
        "computer",
        "monitor",
        "headphone",
        "keyboard",
        "mobile phone",
        "tv",
        "smart watch",
        "tablet",
    ];

      const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        company: "",
        productImageUrl: "",
        properties: {}, 
        weight: "",
        height: "",
        width: "",
        volume: "",
        discount: "",
        amount: "",
        guarantee: "",
        color: "",
        videoUrl: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePropertyChange = (key, value) => {
        setFormData((prev) => ({
        ...prev,
        properties: { ...prev.properties, [key]: value },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };




    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
        console.warn("⚠️ No file selected");
        return;
    }

    console.log("📂 File selected:", file.name);
    setVideoFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        console.log("⏳ Uploading file:", file.name);
        const res = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductImage",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadedUrl = res.data.url;
        setImageUrl(uploadedUrl);

        console.log("✅ Image uploaded. URL:", uploadedUrl);

        try {
        await axios.head(uploadedUrl);
        console.log("✅ Image is accessible on server:", uploadedUrl);
        } catch {
        console.warn("⚠️ Image uploaded, but not accessible yet:", uploadedUrl);
        }

    } catch (err) {
        console.error("❌ Error uploading image:", err);
    }
    };



    const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
        console.warn("⚠️ No file selected");
        return;
    }

    console.log("📂 File selected:", file.name);
    setVideoFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        console.log("⏳ Uploading file:", file.name);
        const res = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductVideo",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadedUrl = res.data.url;
        setVideoUrl(uploadedUrl);

        console.log("✅ Video uploaded. URL:", uploadedUrl);

        try {
        await axios.head(uploadedUrl);
        console.log("✅ Video is accessible on server:", uploadedUrl);
        } catch {
        console.warn("⚠️ Video uploaded, but not accessible yet:", uploadedUrl);
        }

    } catch (err) {
        console.error("❌ Error uploading video:", err);
    }
    };









      const handleAddNow = () => {
            if(lastPage) {
                setLastPage(!lastPage);
            }
            else {
                setButtonActive(!buttonActive); 
                setTimeout(() => {
                setHighlight(!highlight);
                setNewPage(!newPage);
                }, 800);
            }

        };

        const onRight = () => {
            setLastPage(!lastPage);
        }




    return (<>
    <div className={styles.container}>
                {zoomed && <>
                    <div className={styles.subContainer}>
                        {imageUrl && <>
                          <p className={styles.text}>Click on image to return</p>
                          <img
                                className={zoomed ? styles.zoomed : styles.normal}
                                src={imageUrl}
                                width="25%"
                                style={{
                                    marginTop: "1rem",
                                    borderRadius: "1rem",
                                    cursor: "pointer",
                                    transition: "transform 0.3s ease-in-out",
                                    transform: zoomed ? "scale(2)" : "scale(1)",
                                }}
                                onClick={() => setZoomed(!zoomed)}
                            />
                        </>}
                    </div> 
                </>}


                <div   className={styles.middle}  style={{
                    width:"100%",
                    left: buttonActive ? "-65%" : "0%" }}>
                    <div className={styles.design}>
                        <motion.div
                                className={styles.box1}
                                initial={{ rotate: -35, x: -200}}
                                animate={{ rotate: -25, x: 0}}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                            <p className={styles.boxTitle}>Macbook Air</p>
                            <p className={styles.priceTag}>Price:</p>
                            <p className={styles.boxPrice}>2899₼/18 months</p>
                            <p className={styles.guaranteeTag}>Guarantee:</p>
                            <p className={styles.boxGuarantee}>24 months</p>                            
                            <div className={styles.boxLine}></div>
                            <div className={styles.boxLineGuarantee}></div>
                            <img src={Macbook} alt="" />
                        </motion.div>
                        <motion.div className={styles.box2}
                                initial={{ rotate: -22.5, x: -200}}
                                animate={{ rotate: -12.5, x: 0}}
                                transition={{ duration: 1, ease: "easeOut" }}>
                            <p className={styles.boxTitle}>Airpods 3</p>
                            <p className={styles.priceTag}>Price:</p>
                            <p className={styles.boxPrice}>299₼/18 months</p>
                            <p className={styles.guaranteeTag}>Guarantee:</p> 
                            <p className={styles.boxGuarantee}>24 months</p>                            
                            <div className={styles.boxLine}></div>   
                            <div className={styles.boxLineGuarantee}></div>
                            <img src={Airpods} alt="" />
                        </motion.div>
                        <motion.div className={styles.box3}
                                initial={{ rotate: -10, x: -200}}
                                animate={{ rotate: 0, x: 0}}
                                transition={{ duration: 1, ease: "easeOut" }}>
                            <p className={styles.boxTitle}>Iphone 16</p>
                            <p className={styles.priceTag}>Price:</p>
                            <p className={styles.boxPrice}>2399₼/12 months</p>
                            <p className={styles.guaranteeTag}>Guarantee:</p>
                            <p className={styles.boxGuarantee}>24 months</p>                            
                            <div className={styles.boxLine}></div>
                            <div className={styles.boxLineGuarantee}></div>                        
                            <img src={Iphone} alt="" />
                        </motion.div>
                    </div>

                    <motion.div className={styles.addItemContainer}
                            initial={{x: "-45%",y : "-50%"}}
                            animate={{x: "-50%",y : "-50%"}}
                            transition={{ duration: 1, ease: "easeOut" }}
                             style={{
                                left: buttonActive ? "90%" : "83%"}}>
                            <p className={styles.title}>
                            {newPage ?"General Overview" : "Add a New Product"}
                            </p>
                            <p className={styles.subtitle}>
                                {newPage ?  "Provide a brief overview of the product, including its main features and general information." : 
                                "Add your brand-new product here and make it shine. Pick a category, upload images or videos, and fill in all the details to showcase your product to the world. Once saved, it will be live and ready for customers to discover!"
                                }</p>
                            {newPage ? (
                                <>
                                <button className={styles.back} onClick={handleAddNow}>ᐸ</button>
                                <button className={styles.next} onClick={onRight}>ᐳ</button>
                                </>
                            ) : (
                            <button className={styles.addButton} onClick={handleAddNow}>Add now!</button>

                            )}

                    </motion.div>
                </div>
                <div className={styles.right}
                style={{right : lastPage ? "100%" : "0%"}}>
                    <div className={styles.productForm}>

                        <div className={styles.generalInfo}>
                            <p className={styles.generalInfoTitle}>General Information</p>
                            <p className={styles.productNameLabel}>Product Name</p>
                            <input
                            className={styles.productName}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            required
                            />
                            <p className={styles.productDescriptionLabel}>Product Description</p>
                            <textarea
                            name="description"
                            className={styles.productDescription}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            required
                            />
                        </div>


                        <div className={styles.specifiedInfo}>
                            <p className={styles.specifiedInfoTitle}>Specified Information</p>
                            <p className={styles.productCompanyLabel}>Company</p>

                            <input
                            type="text"
                            name="company"
                            className={styles.productCompany}
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Company"
                            required
                            />

                            <p className={styles.productGuaranteeLabel}>Guarantee</p>
                            <input
                            type="text"
                            name="guarantee"
                            value={formData.guarantee}
                            className={styles.productGuarantee}
                            onChange={handleChange}
                            placeholder="Months"
                            pattern="^(100|[1-9][0-9]?)$|^$"
                            />

                            <p className={styles.productColorLabel}>Color</p>
                            <input
                            type="text"
                            name="color"
                            value={formData.color}
                            className={styles.productColor}
                            onChange={handleChange}
                            placeholder="Color"
                            />
                        </div>




                        <div className={styles.priceInfo}>
                        <p className={styles.priceInfoTitle}>Pricing</p>
                        <p className={styles.productPriceLabel}>Price (₼)</p>
                        <input
                        type="text"
                        className={styles.productPrice}
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        pattern="^\d*\.?\d*$|^$"
                        />

                        <p className={styles.isDiscountLabel}>Discount?</p>
                        <select
                            name="hasDiscount"
                            id="discountSelect"
                            value={isDiscount}
                            onChange={(e) => setIsDiscount(e.target.value === "true")}
                        >
                            <option value="">Select</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        {isDiscount && (
                            <>
                        <p className={styles.discountLabel}>Discount Amount</p>
                        <input
                        type="text"
                        name="discount"
                        value={formData.discount}
                        className={styles.productDiscount}
                        onChange={handleChange}
                        placeholder="Discount %"
                        pattern="^(100|[1-9][0-9]?)$|^$"
                        />
                        </>
                        )}
                        </div>


                        <div className={styles.videoSection}>
                            <p className={styles.videoSectionTitle}>Product Media</p>
                            <p className={styles.productImageLabel}>Product Image</p>
                            <div className={styles.imageBox}>

                                 {!imageUrl && (<>
                                  <p className={styles.imageBoxTitle}>Upload a Image for Your Product</p>
                                  <p className={styles.imageBoxSubtitle}>Broadly introduce your products with a detailed images</p>
                                </>)
                                }

                                <input
                                type="file"
                                name="productImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={imageInputRef}
                                style={{ display: "none" }}
                                className={styles.productImage}
                                />
                                <button
                                className={imageUrl ? styles.replaceButton : styles.uploadButton}
                                onClick={() => {
                                    imageInputRef.current.click();
                                }}
                                >
                                {imageUrl ? "Replace Image" : "Upload Image"}
                                </button>

                                {imageUrl && (
                                    <>
                                    
                                        <img
                                        className={zoomed ? styles.zoomed : styles.normal}
                                        src={imageUrl}
                                        width="25%"
                                        style={{
                                            marginTop: "1rem",
                                            borderRadius: "1rem",
                                            cursor: "pointer",
                                            transition: "transform 0.3s ease-in-out",
                                        }}
                                        onClick={() => setZoomed(!zoomed)}
                                        />
                                    
                                    </>
                                    )}
                            </div>

                            <p className={styles.productVideoLabel}>Product Video</p>
                            <div className={styles.videoBox}>
                                {!videoUrl && (<>
                                  <p className={styles.videoBoxTitle}>Upload a Video for Your Product</p>
                                  <p className={styles.videoBoxSubtitle}>Broadly introduce your products with a short, descriptive videos</p>
                                </>)
                                }
                              
                                <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                />
                        
                                <button
                                className={videoUrl ? styles.replaceButton : styles.uploadButton}
                                onClick={() => {
                                    fileInputRef.current.click();
                                }}
                                >
                                {videoUrl ? "Replace Video" : "Upload Video"}
                                </button>

                                {videoUrl && (
                                        <video
                                        src={videoUrl}
                                        controls
                                        width="100%"
                                        style={{ marginTop: "1rem", borderRadius: "1rem" }}
                                        />
                                    )}
                            </div>


                        </div>

                        <div className={styles.categoryContainer}>
                            <p className={styles.categoryContainerTitle}>Category</p>
                                <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                                </select>

                                {category && (
                                <p>
                                    You selected: {category}
                                </p>
                                )}
                            </div>



                        <input
                        type="number"
                        step="0.01"
                        name="weight"
                        className={styles.productWeight}
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Weight"
                        />
                        <input
                        type="number"
                        step="0.01"
                        name="height"
                        value={formData.height}
                        className={styles.productHeight}
                        onChange={handleChange}
                        placeholder="Height"
                        />
                        <input
                        type="number"
                        step="0.01"
                        name="width"
                        value={formData.width}
                        className={styles.productWidth}
                        onChange={handleChange}
                        placeholder="Width"
                        />
                        <input
                        type="number"
                        step="0.01"
                        name="volume"
                        value={formData.volume}
                        className={styles.productVolume}
                        onChange={handleChange}
                        placeholder="Volume"
                        />


                        <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        className={styles.productAmount}
                        onChange={handleChange}
                        placeholder="Amount"
                        required
                        />


                    </div>
   


                </div>
    </div>
    </>);
}

export default AddItem;