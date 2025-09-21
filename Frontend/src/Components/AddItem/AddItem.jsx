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

    const [videoFile, setVideoFile] = useState(null);
    const [item, setItem] = useState({});
    const [videoUrl, setVideoUrl] = useState("");
    const [category, setCategory] = useState(""); 
    const [buttonActive, setButtonActive] = useState(false);
    const [isDiscount, setIsDiscount] = useState(false);

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
        properties: {}, // dynamic key-value
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
        const res = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductVideo",
        formData
        );
        console.log(videoFile);
        const uploadedUrl = res.data.url;

        const updatedProduct = { ...item, videoUrl: uploadedUrl };
        await axios.put(
        "https://techstore-3fvk.onrender.com/api/v1/products/update",
        updatedProduct
        );

        setVideoUrl(uploadedUrl);
        setItem(updatedProduct);

        alert("Video uploaded & saved!");
    } catch (err) {
        console.error(err);
        alert("Error uploading video");
    }
    };

      const handleAddNow = () => {
            setButtonActive(!buttonActive); 
            setTimeout(() => {
            setHighlight(!highlight);
            }, 800);
        };





    return (<>
    <div className={styles.container}>
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
                    {/*
                    <video src={background}
                    autoPlay
                    loop
                    muted
                    style={{
                        right: buttonActive ? "50%" : "0%" 
                    }}
                    ></video>
                     */}
                    <motion.div className={styles.addItemContainer}
                            initial={{x: "-45%",y : "-50%"}}
                            animate={{x: "-50%",y : "-50%"}}
                            transition={{ duration: 1, ease: "easeOut" }}
                             style={{
                                left: buttonActive ? "90%" : "83%"}}>
                        <p className={styles.title}>Add a New Product</p>
                            <p className={styles.subtitle}>Add your brand-new product here and make it shine. Pick a category, upload images or videos, and fill in all the details to showcase your product to the world. Once saved, it will be live and ready for customers to discover!</p>
                            <button className={styles.addButton} onClick={handleAddNow}>Add now!</button>

                    </motion.div>
                </div>
                <div className={styles.right}>
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
                                <input
                                type="file"
                                name="productImage"
                                accept="image/*"
                                style={{ display: "none" }}
                                className={styles.productImage}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setFormData({ ...formData, productImageUrl: imageUrl });
                                    }
                                }}
                                />
                                <label htmlFor="productImage" className={styles.customUploadBtn}>
                                Upload Image
                                </label>
                            </div>

                            <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            />
                    
                            <button
                            className={styles.uploadButton}
                            onClick={() => {
                                fileInputRef.current.click();
                            }}
                            >
                            {videoUrl ? "Replace Video" : "Upload Video"}
                            </button>
                    
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
                    <div className={styles.categoryContainer}>
                        <label htmlFor="category">Choose a category: </label>
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


                </div>

    </div>
    </>);
}

export default AddItem;