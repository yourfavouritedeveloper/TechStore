import { useState, useEffect, useRef } from "react";
import styles from "./EditItem.module.css"
import axios from "axios";
import Iphone from "../../assets/iphonePink.png"
import Airpods from "../../assets/airpods.png"
import Macbook from "../../assets/macbookPink.png"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;


function EditItem({ highlight, setHighlight, username,product}) {

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const navigate = useNavigate();

    const [videoFile, setVideoFile] = useState(null);
    const [item, setItem] = useState({});
    const [videoUrl, setVideoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [categor, setCategor] = useState("");
    const [buttonActive, setButtonActive] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [newPage, setNewPage] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [rows, setRows] = useState([]);

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

    const [initialProduct,setInitialProduct] = useState(product)
    

    const initialFormData = {
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
        bought: "",
        rating: "",
        searched: "",
    };

        const [formData, setFormData] = useState(initialFormData);


        const [isDiscount, setIsDiscount] = useState(false);

        useEffect(() => {
        if (product) {
            setFormData({
            ...product,
            category: product.category.toLowerCase().replace(/_/g, " "),
            
            });

            const initialRows = Object.entries(product.properties || {}).map(([key, value], index) => ({
            id: index,
            key,
            value,
        }));
        setIsDiscount(product.discount>0)
        setRows(initialRows);

        }
        setCategor(formData.category);
        }, [product]);




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
    const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, [field]: newValue } : row
    );
    setRows(updatedRows);

    const newProperties = updatedRows.reduce((acc, row) => {
        if (row.key.trim() !== "") {
        acc[row.key] = row.value;
        }
        return acc;
    }, {});

    setFormData((prev) => ({
        ...prev,
        properties: newProperties,
    }));
    };


 const submitClick = async () => {
    try {



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
            bought: formData.bought ? parseInt(formData.bought) : 0,  
            rating: formData.rating ? parseFloat(formData.rating) : 0,
            searched: formData.searched ? parseInt(formData.searched) : 0
        };


        const res = await axios.put(
            `https://techstore-3fvk.onrender.com/api/v1/products/update`,
            payload
        );
        console.log("✅ Product updated:", res.data);

        navigate(`/account/${username}`);
    } catch (err) {
        console.error("❌ Error updating product:", err);
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
            console.warn("⚠️ No file selected");
            return;
        }

        console.log("📂 File selected:", file.name);
        setVideoFile(file);

        const form = new FormData();
        form.append("file", file);

        try {
            console.log("⏳ Uploading file:", file.name);
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

            console.log("✅ Image uploaded. URL:", uploadedUrl);

              let accessible = false;
                for (let i = 0; i < 5; i++) { 
                    try {
                        await axios.head(uploadedUrl);
                        accessible = true;
                        console.log("✅ Image is accessible on server:", uploadedUrl);
                        break;
                    } catch {
                        console.warn(`⏳ Image not accessible yet, retrying... (${i + 1}/5)`);
                        await new Promise(res => setTimeout(res, 500)); 
                    }
                }

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

        const form = new FormData();
        form.append("file", file);

        try {
            console.log("⏳ Uploading file:", file.name);
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

            console.log("✅ Video uploaded. URL:", uploadedUrl);
            console.log(formData);

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


    useEffect(() => {
    console.log("🔑 Current category:", formData.category);
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
        navigate(`/account/${username}`);
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


        

            <div className={styles.right}
                style={{ right: lastPage ? "100%" : "0%" }}>
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

                            {!formData.productImageUrl && (<>
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
                                className={formData.productImageUrl ? styles.replaceButton : styles.uploadButton}
                                onClick={() => {
                                    imageInputRef.current.click();
                                }}
                            >
                                {formData.productImageUrl ? "Replace Image" : "Upload Image"}
                            </button>

                            {formData.productImageUrl && (
                                <>

                                    <img
                                        className={zoomed ? styles.zoomed : styles.normal}
                                        src={formData.productImageUrl}
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
                            {!formData.videoUrl && (<>
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
                                className={formData.videoUrl ? styles.replaceButton : styles.uploadButton}
                                onClick={() => {
                                    fileInputRef.current.click();
                                }}
                            >
                                {formData.videoUrl ? "Replace Video" : "Upload Video"}
                            </button>

                            {formData.videoUrl && (
                                <video
                                    src={formData.videoUrl}
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

                     <div className={styles.properties}>
                        <p className={styles.propertiesTitle}>Properties</p>
                        <p className={styles.propertyLabel}>Property</p>

                        <ul>
                        {rows.map((row) => (
                            <li className={styles.property} key={row.id}>
                            <input
                                className={styles.key}
                                type="text"
                                placeholder="Key"
                                value={row.key}
                                onChange={(e) => updateRow(row.id, "key", e.target.value)}
                            />
                            <input
                                className={styles.value}
                                type="text"
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
                            name="amount"
                            value={formData.amount}
                            className={styles.productAmount}
                            onChange={handleChange}
                            placeholder="Amount"
                            required
                        />
                    </div>
                    <div className={styles.submittion}>
                        <button className={styles.submit} onClick={submitClick}>Save Product</button>
                        <button className={styles.cancel} onClick={cancelClick}>Cancel</button>
                    </div>



                </div>



            </div>

        </div>
    </>);
}

export default EditItem;