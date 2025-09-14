import { useState,useEffect, useRef  } from "react";
import styles from "./AddItem.module.css"
import axios from "axios";
import background from "../../assets/backgroundItem.mp4"

function AddItem() {

    const fileInputRef = useRef(null);

    const [videoFile, setVideoFile] = useState(null);
    const [item, setItem] = useState({});
    const [videoUrl, setVideoUrl] = useState("");
    const [category, setCategory] = useState(""); 
    const [buttonActive, setButtonActive] = useState(false);

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
        };





    return (<>
    <div className={styles.container}>
                <div   className={buttonActive ? styles.left : styles.middle}  style={{width:"100%"}}>
                    <video src={background}
                    autoPlay
                    loop
                    muted
                    ></video>
                    <div className={styles.addItemContainer}>
                        <p className={styles.title}>Add a New Product</p>
                        <div className={styles.box}>
                            <p className={styles.subtitle}>Add your brand-new product here and make it shine. Pick a category, upload images or videos, and fill in all the details to showcase your product to the world. Once saved, it will be live and ready for customers to discover!</p>
                            <button className={styles.addButton}>Add now!</button>
                        </div>

                    </div>
                </div>
                <div className={styles.right}  style={{display:"none",left:"100%"}}>
                    <div className={styles.categoryContainer}>
                        <label htmlFor="category">Choose a category:</label>
                        <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        >
                        <option value="">-- Select a category --</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                            {cat}
                            </option>
                        ))}
                        </select>

                        {category && (
                        <p>
                            You selected: <strong>{category}</strong>
                        </p>
                        )}
                    </div>
                    <div className={styles.videoSection}>
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

                </div>

    </div>
    </>);
}

export default AddItem;