import styles from "./Account.module.css"
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import spinner from "../../../public/brandlogo.png"
import spinnerBlack from "../../../public/brandblack.png"
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Utils/cropImage"; 

    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;

    

function Account({ account, edit, setEdit }) {

      const [cropModalOpen, setCropModalOpen] = useState(false);
      const [cropImageSrc, setCropImageSrc] = useState(null);
      const [crop, setCrop] = useState({ x: 0, y: 0 });
      const [zoom, setZoom] = useState(1);
      const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


      

      const [purchases, setPurchases] = useState([]);
      const [sellPurchases, setSellPurchases] = useState([]);
      const [logAccount, setLogAccount] = useState(account);
      const [draftAccount, setDraftAccount] = useState(account);
      const [checkAccount, setCheckAccount] = useState(account);
      const [loading, setLoading] = useState(false);
      const [isError, setIsError] = useState(false);
      const [isErrorPassword, setIsErrorPassword] = useState(false);
      const [password, setPassword] = useState("");
      const [passwordCheck, setPasswordCheck] = useState("");
      const [showPassword,setShowPassword] = useState(false);
      const [showPassword1,setShowPassword1] = useState(false); 
      const [errors, setErrors] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      });

      useEffect(() => {
      if (!password) { 
        setErrors({
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
        });
        return;
      }

        
        const newErrors = {
          length: password.length < 8,
          lowercase: !/[a-z]/.test(password),
          uppercase: !/[A-Z]/.test(password),
          number: !/[0-9]/.test(password),
          special: !/[^A-Za-z0-9]/.test(password),
        };

        setErrors(newErrors);
      }, [password]);

    useEffect(() => {
      const hasError = Object.values(errors).some((val) => val === true);
      setIsErrorPassword(hasError);
    }, [errors]);

      useEffect(() => {
        setLogAccount(account);
        setDraftAccount(account);
      }, [account]);

      const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          setCropImageSrc(reader.result);
          setCropModalOpen(true);
        };
        reader.readAsDataURL(file);
      };

      const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      };

      const saveCroppedImage = async () => {
        try {
          setLoading(true);
          const blob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
          const formData = new FormData();
          formData.append("file", blob, "profile.png");

          const previewUrl = URL.createObjectURL(blob);
          setLogAccount(prev => ({ ...prev, profilePictureUrl: previewUrl }));
          setDraftAccount(prev => ({ ...prev, profilePictureUrl: previewUrl }));

          const res = await axios.post(
            "https://techstore-3fvk.onrender.com/api/v1/accounts/uploadProfilePicture",
            formData,
            { auth: { username: USERNAME, password: PASSWORD } }
          );

          let fileUrl = res.data.url.startsWith('/') 
            ? `https://techstore-3fvk.onrender.com${res.data.url}` 
            : res.data.url;
          fileUrl += `?t=${Date.now()}`;

          setLogAccount(prev => ({ ...prev, profilePictureUrl: fileUrl }));
          setDraftAccount(prev => ({ ...prev, profilePictureUrl: fileUrl }));
          setCropModalOpen(false);
        } catch (err) {
          console.error(err);
        }finally {
          setLoading(false);
        }
      };


  useEffect(() => {
    if (!account?.id) return;

    axios
      .get(`https://techstore-3fvk.onrender.com/api/v1/purchases/account/to/${logAccount.id}`,
        {
        auth: {
            username: USERNAME, 
            password: PASSWORD
        }
        }
        
      )
      
      .then((response) => {
        setSellPurchases(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, [logAccount]);

  

const getLastMonthData = (purchases = []) => {
  const now = new Date();
  const dates = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dates.push(d.toLocaleDateString());
  }

  const purchaseMap = purchases.reduce((acc, p) => {
    const date = new Date(p.purchaseDate).toLocaleDateString();
    const totalSpent = (p.product?.price || 0) * (p.amount || 0);
    acc[date] = (acc[date] || 0) + totalSpent;
    return acc;
  }, {});

  return dates.map(date => ({
    date,
    amount: purchaseMap[date] || 0
  }));
};



const purchaseData = getLastMonthData(logAccount?.purchases || []);

const tickDates = (() => {
  const len = purchaseData.length;
  if (len === 0) return [];
  return [
    purchaseData[0].date, 
    purchaseData[Math.floor(len / 2)].date, 
    purchaseData[len - 1].date 
  ];
})();




const getLastMonthDataSell = (sellPurchases = []) => {
  const now = new Date();
  const dates = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dates.push(d.toLocaleDateString());
  }

  const purchaseMap = sellPurchases.reduce((acc, p) => {
    const date = new Date(p.purchaseDate).toLocaleDateString();
    const totalSpent = (p.product?.price || 0) * (p.amount || 0);
    acc[date] = (acc[date] || 0) + totalSpent;
    return acc;
  }, {});

  return dates.map(date => ({
    date,
    amount: purchaseMap[date] || 0
  }));
};

const updateChanges = () => {
  setEdit(!edit);
  setDraftAccount(logAccount); 
  setPassword("");
  setPasswordCheck("");
  setShowPassword(false);
  setShowPassword1(false);

};

const purchaseDataSell = getLastMonthDataSell(sellPurchases || []);

const tickDatesSell = (() => {
  const len = purchaseDataSell.length;
  if (len === 0) return [];
  return [
    purchaseDataSell[0].date, 
    purchaseDataSell[Math.floor(len / 2)].date, 
    purchaseDataSell[len - 1].date 
  ];
})();



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalItems = logAccount.products ? logAccount.products.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = logAccount.products
    ? logAccount.products.slice(startIndex, startIndex + itemsPerPage)
    : [];

    return  logAccount.profilePictureUrl ? (
    <>
        {loading && <div className={styles.loadingContainerPage}>
            <img src={spinnerBlack} alt="Loading..." className={styles.loadingImage} />
        </div>}
        <div className={styles.container}>
            <div className={`${styles.account} ${edit ? styles.active : ""}`}>
              {edit ? (
              <>
              <p className={styles.editPpTitle}>Edit Profile Picture</p>
              <label className={styles.uploadButton}>

                <p>+</p>
                <input type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: 'none' }} />
              </label>
              {draftAccount.profilePictureUrl && (
                <>
                <p className={styles.ppPreviewTitle}>Preview</p>
              <img
                src={draftAccount.profilePictureUrl}
                alt="Preview"
                className={styles.ppPreview}
              />
              </>
            )}
              </>
              ) : (
                <img className={styles.pp} src={logAccount.profilePictureUrl} alt="Profile" />
              )}
                
                {logAccount.backgroundImageUrl ? (<></>) : <></>}
                <div className={styles.name}>
                  {edit ? (
                    <>
                    <p className={styles.editName}>Full Name</p>
                    <textarea
                      className={styles.nameInput}
                      value={draftAccount.customerName}
                      onChange={(e) =>
                        setDraftAccount((prev) => ({ ...prev, customerName: e.target.value }))
                      }
                    />
                    </>
                  ) : (
                    <p className={styles.customerName}>{logAccount.customerName}</p>
                  )}

                  {edit ? (
                    <>
                    <p className={styles.editUsername}>Username</p>
                    {isError ? (
                      <p className={styles.errorUsername}>This username is taken!</p>
                    ) : ( 
                      <p className={styles.confirmUsername}> Valid username!</p>
                    )}
                    <textarea
                      className={styles.usernameInput}
                      value={draftAccount.username}
                      onChange={(e) =>
                      {
                        const newUsername = e.target.value;
                        setDraftAccount((prev) => ({ ...prev, username: newUsername  }));
                        axios.get(
                        `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${newUsername}`,
                          
                        {
                          auth: { username: USERNAME, password: PASSWORD },
                        }
                      )
                      .then((response) => {
                        setCheckAccount(response.data);
                        if(response.data?.username === newUsername) {
                          setIsError(true);
                        }
                        else {
                        }
                        
                      })
                      .catch((err) => {
                        if (err.response?.status === 404) {
                          setCheckAccount(null);
                          setIsError(false);
                        } else {
                          console.error("Unexpected error:", err);
                        }
                      });
                      }
                      }
                    />
                    </>
                  ) : (
                    <p className={styles.username}>@{logAccount.username}</p>
                  )}
                  {edit ? (
                    <>
                      <p className={styles.editPassword}>New Password</p>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={styles.passwordInput}
                        placeholder="Enter a password"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <p className={styles.editPasswordAgain}>Password Again</p>
                      <input
                        type={showPassword1 ? "text" : "password"}
                        className={styles.passwordAgainInput}
                        placeholder="Repeat password"
                        value={passwordCheck}
                        autoComplete="new-password"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setPasswordCheck(newValue);
                          if (newValue && password && newValue !== password) {
                            setIsErrorPassword(true);
                          } else {
                            setIsErrorPassword(false);
                          }
                        }}
                      />
                        <button
                          type="button"
                            onClick={() => setShowPassword(!showPassword)}
                              className={styles.toggleBtn1}
                              >
                             {showPassword ? (
                      
                             <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#333333ff">
                              <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                              </svg>
                              ) : (
                      
                               <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#333333ff">
                               <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                               </svg>
                                )}
                        </button>
                      
                      
                                <button
                                type="button"
                                onClick={() => setShowPassword1(!showPassword1)}
                                className={styles.toggleBtn2}
                                >
                               {showPassword1 ? (
                      
                               <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="#333333ff">
                               <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                              </svg>
                             ) : (
                      
                             <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="#333333ff">
                             <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                             </svg>
                            )}
                        </button>
                        <div className={styles.passwordContainer}>
                            <p className={styles.passwordTitle}>Must Contain:</p>
                            <p className={styles.passwordType} style ={{backgroundColor: errors.special ? "rgb(255, 81, 81)" : "rgb(48, 165, 93)" }}>At least one special symbol</p>
                            <p className={styles.passwordType}  style ={{backgroundColor: errors.uppercase ? "rgb(255, 81, 81)" : "rgb(48, 165, 93)" }}>At least one uppercase letter</p>
                            <p className={styles.passwordType}  style ={{backgroundColor: errors.lowercase ? "rgb(255, 81, 81)" : "rgb(48, 165, 93)" }}>At least one lowercase letter</p>
                            <p className={styles.passwordType}  style ={{backgroundColor: errors.number ? "rgb(255, 81, 81)" : "rgb(48, 165, 93)" }}>At least one numeric digit</p>
                            <p className={styles.passwordType}  style ={{backgroundColor: errors.length ? "rgb(255, 81, 81)" : "rgb(48, 165, 93)" }}>A minimum length of 8 characters</p>

                        </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
            </div>
            <div className={`${styles.balanceContainer} ${edit ? styles.hidden : ""}`}>
                <p className={styles.balance}>Balance: ₼{logAccount.balance}</p>
                <button className={styles.add}>Add Balance</button>
                <button className={styles.transaction}>Transaction History</button>
            </div>
            <p className={`${styles.descriptionTitle} ${edit ? styles.active : ""}`}>Description</p>
            <div className={`${styles.accountDescription} ${edit ? styles.active : ""}`}>
                  {edit ? (
                    <textarea
                      className={styles.descriptionInput}
                      value={draftAccount.description}
                      onChange={(e) =>
                        setDraftAccount((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  ) : (
                    <p className={styles.description}>{logAccount.description}</p>
                  )}
            </div>
            <div className={ !(isError || isErrorPassword) ? ` ${styles.editContainer} ${edit ? styles.active : ""}` : styles.errorEditContainer}>
              <p className={styles.editTitle}>Edit Your Profile</p>

              {edit ? (
                <>
                  <button className={styles.cancel} onClick={updateChanges}>Cancel</button>
                  <button
                    className={!(isError || isErrorPassword) ? styles.saveEdit : styles.errorSave}
                    onClick={async () => {
                      try {
                        setLoading(true);

                        const accountResponse = await axios.put(
                          `https://techstore-3fvk.onrender.com/api/v1/accounts/update`,
                          draftAccount, 
                          { auth: { username: USERNAME, password: PASSWORD } }
                        );
                        setLogAccount(accountResponse.data);

                        if(password && password !== "") {
                          const passwordResponse = await axios.put(
                            `https://techstore-3fvk.onrender.com/api/v1/accounts/password`,
                            {}, 
                            {
                              params: { id: draftAccount.id, password },
                              auth: { username: USERNAME, password: PASSWORD }
                            }
                          );
                          setLogAccount(passwordResponse.data);
                        }

                        setEdit(false); 
                      } catch(err) {
                        console.error("Error saving account:", err);
                      } finally {
                        setLoading(false); 
                      }
                    }}

                  >
                    Save
                  </button>
                </>
              ) : (<>
                  <button className={styles.edit} onClick={updateChanges}>Update</button>
                  <button className={styles.save}>Save</button>
              </>)}
            </div>

            <div className={`${styles.activityContainer} ${edit ? styles.hidden : ""}`}>
                <p className={styles.activityTitle}>Money Earned from Products</p>
                <p className={styles.activitySubTitle}>This chart shows how much money you earned each day from your product sales in the last month. Days without sales appear as zero, and the dates at the start, middle, and end make it easy to track your earnings over time.</p>
            <div className={styles.chart}>
                <ResponsiveContainer height={300}>
                <LineChart data={purchaseDataSell.length > 0 ? purchaseDataSell : [{ date: 'No Data', amount: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" ticks={tickDatesSell} />
                    <YAxis domain={[0, 'auto']} /> 
                    <Tooltip 
                    formatter={(value, name) => [`₼${value.toFixed(2)}`, 'Money Earned']}
                    labelFormatter={(label) => `Date: ${label}`} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                    <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={true} 
                    />
                </LineChart>
                </ResponsiveContainer>

            </div>
            </div>

            <div className={styles.itemsContainer}>
                <p className={styles.itemTitle}>Your Items for Sale</p>
                <p className={styles.itemSubtitle}>Here are all the products you’re currently selling. Click an item to view or edit its details.</p>
                      <ul className={styles.items}>
                       {currentItems && currentItems.length > 0 ? (  
                        currentItems.map((item) => (
                          <Link key={item.id} className={styles.item} 
                          to= {"/product/edit/" + item.id}
                          style={{ backgroundColor: "rgba(247, 247, 247, 1)" }}>
                            <img src={item.productImageUrl} alt={item.name}/>
                            <div className={styles.info}>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <p className={styles.price}>₼{item.price}</p>
                            </div>
                          </Link>
                        ))) : (
                            <li className={styles.noItem}>
                              <p>No item found</p>
                            </li>)}
                              <li className={styles.addItem}>
                                <Link
                                to={"/" + logAccount.username + "/product/add"}
                                className={styles.item}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "2rem",
                                    color: "#3B82F6",
                                    backgroundColor: "rgba(247, 247, 247, 1)",
                                }}
                                >
                                +
                                    <div className={styles.info}>
                                        <p className={styles.name}>Add a new Item</p>
                                    </div>
                                </Link>
                            </li>
                      </ul>
                      {totalPages > 1 && (
                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ""}`}
                            >
                                {i + 1}
                            </button>
                            ))}
                        </div>
                        )}
            </div>

            <div className={styles.purchaseContainer}>
                <p className={styles.itemTitle}>Purchase History</p>
                <p className={styles.itemSubtitle}>View all your past purchases in one place. Easily track what you bought, when you bought it, and how much you spent.</p>
            </div>
              <div className={styles.spentContainer}>
                <p className={styles.activityTitle}>Money Spent in Purchases</p>
                <p className={styles.activitySubTitle}>This chart shows how much money you spent each day in the last month. Days with no purchases show as zero, and the dates at the start, middle, and end make it easy to see your spending over time.</p>
            <div className={styles.chart}>
                <ResponsiveContainer height={300}>
                <LineChart data={purchaseData.length > 0 ? purchaseData : [{ date: 'No Data', amount: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" ticks={tickDates} />
                    <YAxis domain={[0, 'auto']} /> 
                    <Tooltip 
                    formatter={(value, name) => [`₼${value.toFixed(2)}`, 'Money Spent']}
                    labelFormatter={(label) => `Date: ${label}`} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                    <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#f63b3bff" 
                    strokeWidth={2} 
                    dot={true} 
                    />
                </LineChart>
                </ResponsiveContainer>

            </div>
            </div>


        </div>
            {cropModalOpen && (
      <div className={styles.cropModal}>
        <div className={styles.cropContainer}>
          <Cropper
            image={cropImageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
        </div>
        <button onClick={saveCroppedImage}>Save</button>
        <button onClick={() => setCropModalOpen(false)}>Cancel</button>
      </div>
    )}
    </>) : (
        <>
        <div className={styles.loadingContainer}>
            <img src={spinner} alt="Loading..." className={styles.loadingImage} />
        </div>

        
    </>
    
    
    );
}

export default Account;