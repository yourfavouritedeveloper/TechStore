import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Recovery.module.css";

function Recovery() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading,setIsLoading] = useState(false);

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

    if (!token) {
        return (
        <div className={styles.containerWhite}>
            <p className={styles.errorMsg}>Invalid or missing recovery link.</p>
        </div>
        );
    }


    const handleReset = async (e) => {
        e.preventDefault();




        if (password !== passwordAgain) {
            setErrorMsg("Passwords do not match.");
            setTimeout(() => setErrorMsg(""), 3000);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.put(
            `https://techstore-3fvk.onrender.com/api/v1/accounts/password?password=${password}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccessMsg("Password reset successfully!");
        } catch (error) {
            setErrorMsg("Invalid or expired link.");
        } finally {
            setTimeout(() => setErrorMsg(""), 3000);
            setIsLoading(false);
        }
    };

  return (
  <form onSubmit={handleReset}>
        <div 
        className={styles.container}
        >
                      <p
                        className={styles.errorMsg}
                        style={{top: errorMsg? "2.4rem" : "-7rem"}}
                        >
                      {errorMsg}
                      </p>

                      <p
                      className={styles.safeMsg}
                      style={{top: successMsg? "2.4rem" : "-7rem"}}

                    >
                      {successMsg}
                    </p>

          <div className={styles.backgroundDiv}>
              <p className={styles.backgroundTitle}>Recover Your Account</p>
            <p></p>
          </div>
            <div
             className={styles.box}
             >
                    <div className={styles.logDiv}>
                      <label htmlFor="password" className={styles.labelPassword}>New Password</label>
                      <input id="password" 
                      type={showPassword1 ? "text" : "password"}
                      maxLength={50} 
                      className={styles.password}  
                      placeholder="Enter Your New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}  
                      />

                      <label htmlFor="passwordAgain" className={styles.labelPasswordAgain}>New Password Again</label>
                      <input id="passwordAgain" 
                      maxLength={50}
                      type={showPassword2 ? "text" : "password"}
                      className={styles.passwordAgain}  
                      placeholder="Enter Your New Password Again"
                      value={passwordAgain}
                      onChange={(e) => setPasswordAgain(e.target.value)}
                      />

                      <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className={styles.toggleBtn1}
                      >
                      {showPassword1 ? (

                          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#333333ff">
                          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                          </svg>
                      ) : (

                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
                          <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                          </svg>
                          )}
                      </button>


                     <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className={styles.toggleBtn2}
                        >
                        {showPassword2 ? (

                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#333333ff">
                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                            </svg>
                        ) : (

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
                            <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                            </svg>
                            )}
                      </button>


                      <button
                          className={styles.submit}
                          type="submit">                      
                          {loading ? (
                            <span className={styles.loader}></span>
                          ) : (
                            "Save Changes"
                          )}</button>

                  </div>
                  </div>
          
        </div>

        </form>
  );
}

export default Recovery;
