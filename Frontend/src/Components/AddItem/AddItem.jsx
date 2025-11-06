import { useState, useEffect, useRef, useContext } from "react";
import styles from "./AddItem.module.css"
import axios from "axios";
import background from "../../assets/backgroundItem.mp4"
import Iphone from "../../assets/iphonePink.png"
import Airpods from "../../assets/airpods.png"
import Macbook from "../../assets/macbookPink.png"
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";



    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;


function AddItem({ highlight, setHighlight, username}) {

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [videoFile, setVideoFile] = useState(null);
    const [item, setItem] = useState({});
    const [videoUrl, setVideoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categor, setCategor] = useState("");
    const [buttonActive, setButtonActive] = useState(false);
    const [isDiscount, setIsDiscount] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [newPage, setNewPage] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [rows, setRows] = useState([]);
    const {account, token,refreshToken, refreshAccessToken} = useContext(AuthContext)

    
    useEffect(() => { 
        if (!refreshToken) { 
            navigate("/login", { state: { from: location } }); 
        } 
        else if (!token) {
             refreshAccessToken(); 
        } 
    }, [token,refreshToken, navigate, location,refreshAccessToken]);

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

    const initialFormData = {
        name: "",
        description: "",
        longDescription: "",
        price: 0,
        category: "",
        company: "",
        productImageUrl: "",
        properties: {},
        weight: 0,
        height: 0,
        width: 0,
        volume: 0,
        discount: 0,
        amount: 0,
        guarantee: 0,
        color: "",
        videoUrl: "",
        bought: 0,
        rating: 0,
        rating_count: 0,
        searched: 0
    };

        const [formData, setFormData] = useState(initialFormData);


    const addRow = () => {
        setRows((prev) => [
            ...prev,
            { id: prev.length, key: "", value: "" }
        ]);
    };

    const removeRow = () => {
        setRows((prev) => prev.slice(0, -1));
    };



    const updateRow = (id, field, newValue) => {
        setRows((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, [field]: newValue } : row
            )
        );

        setFormData((prev) => {
        const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, [field]: newValue } : row
        );

        const newProperties = updatedRows.reduce((acc, row) => {
        if (row.key.trim() !== "") {
            acc[row.key] = row.value;
        }
        return acc;
        }, {});

        return {
        ...prev,
        properties: newProperties,
        };
    });
    };


 const submitClick = async () => {
    try {
        const accountRes = await axios.get(
            `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${username}`,
                    {
                        headers: {
                        Authorization: `Bearer ${token}`,
                        },
                    
                    }
        );
        const accountData = accountRes.data;
        const accountSummary = {
            id: accountData.id,
            username: accountData.username,
            customerName: accountData.customerName,
            email: accountData.email,
            profilePictureUrl: accountData.profilePictureUrl,
            description: accountData.description, 
            status: accountData.status
        };

        const payload = {
            ...formData,
            price: formData.price ? parseFloat(formData.price) : 0,
            weight: formData.weight ? parseFloat(formData.weight) : 0,
            height: formData.height ? parseFloat(formData.height) : 0,
            width: formData.width ? parseFloat(formData.width) : 0,
            volume: formData.volume ? parseFloat(formData.volume) : 0,
            discount: formData.discount ? parseInt(formData.discount) : 0,
            amount: formData.amount ? parseInt(formData.amount) : 0,
            guarantee: formData.guarantee ? Number(formData.guarantee) : 0,
            category: formData.category.toUpperCase().replace(/\s+/g, "_"),
            properties: formData.properties || {},
            productImageUrl: formData.productImageUrl || "",
            videoUrl: formData.videoUrl || null,
            account: accountSummary,
            bought: 0,      
            rating: 0,  
            rating_count: 0,    
            searched: 0     
        };


        const res = await axios.post(
            "https://techstore-3fvk.onrender.com/api/v1/products/create",

            payload
        );

        navigate(`/account/${username}`);
    } catch (err) {
        console.error("Error creating product:", err);
    }
};







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
            console.warn("No file selected");
            return;
        }

        setVideoFile(file);

        const form = new FormData();
        form.append("file", file);

        try {
            const res = await axios.post(
                "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductImage",
                form,
            );

            const uploadedUrl = res.data.url;
            setImageUrl(uploadedUrl);

            setFormData((prev) => ({
            ...prev,
            productImageUrl: uploadedUrl,
            }));


              let accessible = false;
                for (let i = 0; i < 5; i++) { 
                    try {
                        await axios.head(uploadedUrl);
                        accessible = true;
                        break;
                    } catch {
                        console.warn(`Image not accessible yet, retrying... (${i + 1}/5)`);
                        await new Promise(res => setTimeout(res, 500)); 
                    }
                }

            try {
                await axios.head(uploadedUrl);
            } catch {
                console.warn("Image uploaded, but not accessible yet:", uploadedUrl);
            }

        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };





    const handleVideoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.warn("No file selected");
            return;
        }

        setVideoFile(file);

        const form = new FormData();
        form.append("file", file);

        try {
            const res = await axios.post(
                "https://techstore-3fvk.onrender.com/api/v1/products/uploadProductVideo",
                form,
            );

            const uploadedUrl = res.data.url;
            setVideoUrl(uploadedUrl);

                setFormData((prev) => ({
                ...prev,
                videoUrl: uploadedUrl,
                }));

            console.log(formData);

            try {
                await axios.head(uploadedUrl);
            } catch {
                console.warn("Video uploaded, but not accessible yet:", uploadedUrl);
            }

        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };


    useEffect(() => {
    }, [formData.category]);








    const handleAddNow = () => {
        if (lastPage) {
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

    const cancelClick = () => {
        setButtonActive(!buttonActive);
        setTimeout(() => {
            setHighlight(!highlight);
            setNewPage(!newPage);
        }, 800);
        setLastPage(!lastPage);
        setFormData(initialFormData);
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


            <div className={styles.middle} style={{
                width: "100%",
                left: buttonActive ? "-65%" : "0%"
            }}>
                <div className={styles.design}>
                    <motion.div
                        className={styles.box1}
                        initial={{ rotate: -35, x: -200 }}
                        animate={{ rotate: -25, x: 0 }}
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
                        initial={{ rotate: -22.5, x: -200 }}
                        animate={{ rotate: -12.5, x: 0 }}
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
                        initial={{ rotate: -10, x: -200 }}
                        animate={{ rotate: 0, x: 0 }}
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

                <div className={(newPage || lastPage) ? styles.containerAddDiv : styles.containerDiv}>
                <motion.div className={styles.addItemContainer}
                    initial={{ x: "-45%", y: "-50%" }}
                    animate={{ x: "-50%", y: "-50%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        left: buttonActive ? "90%" : "83%"
                    }}>
                    <p className={styles.title}
                    style={{left: newPage || lastPage ? "2%" : "12.5%"}}>
                        {newPage ? (lastPage ? "Property Overview" : "General Overview") : "Add a New Product"}
                    </p>
                    <p className={styles.subtitle}
                    style={{left: newPage || lastPage ? "6.5%" : "17%"}}>
                        {newPage ? (lastPage ? "Add the essential product characteristics that describe its functionality and build." : "Provide a brief overview of the product, including its main features and general information.") :
                            "Add your brand-new product here and make it shine. Pick a category, upload images or videos, and fill in all the details to showcase your product to the world. Once saved, it will be live and ready for customers to discover!"
                        }</p>
                    {newPage ? (
                        <>
                            <button className={styles.back} style={{ right: lastPage ? "38%" : "48%" }} onClick={handleAddNow}>ᐸ</button>

                            {lastPage ? (
                                <></>
                            ) : (
                                <button className={styles.next} onClick={onRight}>ᐳ</button>
                            )}
                        </>
                    ) : (
                        <button className={styles.addButton} onClick={handleAddNow}>Add now!</button>
                    )}

                </motion.div>
                </div>
            </div>

            <div className={styles.right}
                style={{ right: lastPage ? "100%" : "-8%" }}>
                <div className={styles.productForm}>

                    <div className={styles.generalInfo}>
                        <p className={styles.generalInfoTitle}>General Information</p>
                        <p className={styles.productNameLabel}>Product Name</p>
                        <input
                            className={styles.productName}
                            type="text"
                            maxLength={50}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            required
                        />
                        <p className={styles.productDescriptionLabel}>Product Sub Title</p>
                        <textarea
                            name="description"
                            maxLength={120}
                            className={styles.productDescription}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Sub Title"
                            required
                        />
                        <p className={styles.productLongDescriptionLabel}>Product Description</p>
                        <textarea
                            name="longDescription"
                            maxLength={770}
                            className={styles.productLongDescription}
                            value={formData.longDescription}
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
                            maxLength={50}
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
                            maxLength={50}
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
                            maxLength={50}
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
                            maxLength={50}
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
                                    maxLength={50}
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
                            value={categor}
                            onChange={
                                (e) => {
                                    const normalized = e.target.value.toUpperCase().replace(/\s+/g, "_");
                                    setCategor(e.target.value);
                                    setFormData((prev) => ({
                                    ...prev,
                                    category: normalized, 
                                    }));
                                }}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>

                    </div>




                </div>



            </div>
            <div className={styles.last}>
                <div className={styles.productForm}>
                    <div className={styles.properties}>
                        <p className={styles.propertiesTitle}>Properties</p>
                        <p className={styles.propertyLabel}>Property</p>

                        <ul>
                            {rows.map((row) => (
                                <li className={styles.property} key={row.id}>
                                    <input
                                        className={styles.key}
                                        type="text"
                                        maxLength={50}
                                        placeholder="Key"
                                        value={row.key}
                                        onChange={(e) => updateRow(row.id, "key", e.target.value)}
                                    />
                                    <input
                                        className={styles.value}
                                        type="text"
                                        maxLength={50}
                                        placeholder="Value"
                                        value={row.value}
                                        onChange={(e) => updateRow(row.id, "value", e.target.value)}
                                    />
                                </li>
                            ))}
                        </ul>

                        <button className={styles.add} onClick={addRow}>+ Add a new Property</button>
                        <button className={styles.remove} onClick={removeRow}>- Remove the Property</button>

                    </div>
                    <div className={styles.measurements}>
                        <p className={styles.measurementsTitle}>Measurements</p>
                        <p className={styles.weightLabel}>Weight</p>
                        <input
                            type="text"
                            maxLength={50}
                            step="0.01"
                            name="weight"
                            className={styles.productWeight}
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="Weight"
                            pattern="^\d*\.?\d*$|^$"
                        />

                        <p className={styles.heightLabel}>Height</p>
                        <input
                            type="text"
                            maxLength={50}
                            step="0.01"
                            name="height"
                            value={formData.height}
                            className={styles.productHeight}
                            onChange={handleChange}
                            placeholder="Height"
                            pattern="^\d*\.?\d*$|^$"

                        />

                        <p className={styles.widthLabel}>Width</p>
                        <input
                            type="text"
                            maxLength={50}
                            step="0.01"
                            name="width"
                            value={formData.width}
                            className={styles.productWidth}
                            onChange={handleChange}
                            placeholder="Width"
                            pattern="^\d*\.?\d*$|^$"
                        />

                        <p className={styles.volumeLabel}>Volume</p>
                        <input
                            type="text"
                            maxLength={50}
                            step="0.01"
                            name="volume"
                            value={formData.volume}
                            className={styles.productVolume}
                            onChange={handleChange}
                            placeholder="Volume"
                            pattern="^\d*\.?\d*$|^$"
                        />

                        <p className={styles.amountLabel}>Amount</p>
                        <input
                            type="number"
                            maxLength={50}
                            name="amount"
                            value={formData.amount}
                            className={styles.productAmount}
                            onChange={handleChange}
                            placeholder="Amount"
                            required
                        />
                    </div>
                    <div className={styles.submittion}>
                        <button className={styles.submit} onClick={submitClick}>Add Product</button>
                        <button className={styles.cancel} onClick={cancelClick}>Cancel</button>
                    </div>

                </div>
            </div>
        </div>
    </>);
}

export default AddItem;