import { useState,useEffect, useRef  } from "react";
import styles from "./AddItem.module.css"
import axios from "axios";


function AddItem() {

    const fileInputRef = useRef(null);

    const [videoFile, setVideoFile] = useState(null);
    const [item, setItem] = useState({});
    const [videoUrl, setVideoUrl] = useState("");


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





    return (<>
    <div className={styles.container}>
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
    </div>
    </>);
}

export default AddItem;