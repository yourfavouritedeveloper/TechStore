import styles from "./Login.module.css";
import { motion, useInView, useAnimation,AnimatePresence  } from "framer-motion";
import React, { useEffect, useRef, useState,useContext  } from "react";
import { Link,useNavigate, useLocation ,Navigate  } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import BrandLogo from "../../../public/brandlogowhite.png"
import Mixed from "../../assets/mixed.png"

function Login() {





const [isLoading, setIsLoading] = useState(false);
const [isSecond, setIsSecond] = useState(false);
const circleRef1 = useRef(null);
const circleRef2 = useRef(null);
const boxRef = useRef(null);
const techStoreRef = useRef(null);
const submitRef = useRef(null);


const circleInView1 = useInView(circleRef1, { once: true });
const circleInView2 = useInView(circleRef2, { once: true });
const boxInView = useInView(boxRef, { once: true });
const techStoreInView = useInView(techStoreRef, { once: true });
const submitInView = useInView(submitRef, { once: true });


const controls1 = useAnimation();
const controls2 = useAnimation();
const boxControls = useAnimation();
const techStoreControls = useAnimation();
const submitControls = useAnimation();


useEffect(() => {
  if (circleInView1) controls1.start("visible");
}, [circleInView1]);
useEffect(() => {
  if (circleInView2) controls2.start("visible");
}, [circleInView2]);
useEffect(() => {
  if (boxInView) boxControls.start("visible");
}, [boxInView]);
useEffect(() => {
  if (techStoreInView) techStoreControls.start("visible");
}, [techStoreInView]);
useEffect(() => {
  if (submitInView) submitControls.start("visible");
}, [submitInView]);


  const { login, logout, token } = useContext(AuthContext);

  const location = useLocation();
   const sign = location.state?.sign || false;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const from = location.state?.from?.pathname || "/";
  const [isSign, setIsSign] = useState(sign);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("https://techstore-3fvk.onrender.com/api/v1/accounts/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid username or password");

      const data = await response.json();

      const token = data.token || data.jwt || data.accessToken;
      const account = data.account || data.user || { username };

      if (!token) throw new Error("No token received from server");

      login(account, token);
      localStorage.setItem("authToken", token);

      setSuccessMsg("Login Successful!");
      setIsError(false);

      setTimeout(() => navigate(from, { replace: true }), 1000);

    } catch (error) {
      setErrorMsg(error.message || "Network error. Please try again.");
      setIsError(true);
    } finally {
    setIsLoading(false);
  }
  };




 useEffect(() => {
    if (!token) return;

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = exp * 1000 - Date.now();

      if (expiryTime <= 0) {
        logout();
        alert("Session expired. Please log in again.");
        return;
      }

      const timer = setTimeout(() => {
        logout();
        alert("Session expired. Please log in again.");
      }, expiryTime);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, [token, logout]);



 const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);


    const allGood = Object.values(errors).every(Boolean);
      if (!allGood) {
        setErrorMsg("Password does not meet requirements.");
        setIsError(true);
        setTimeout(() => setErrorMsg(""), 3500);
        setIsLoading(false);
        return;
      }

    try {
      if (password !== passwordAgain) {
        setErrorMsg("Passwords do not match.");
        setIsError(true);
        setTimeout(() => setErrorMsg(""), 3000);
        setIsLoading(false);
        return;
      }

      const signup = await fetch("https://techstore-3fvk.onrender.com/api/v1/accounts/register", {
        method: "POST",
        body: JSON.stringify({
          customerName: `${firstName} ${lastName}`,
          username,
          password,
          email
        }),
      });

      if (signup.status !== 201) {
        const errMsg = (await signup.json()).message || "Sign up failed.";
        throw new Error(errMsg);
      }

      const response = await fetch("https://techstore-3fvk.onrender.com/api/v1/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      const token = data.token;
      const account = data.account || { username };

      login(account, token);
      localStorage.setItem("authToken", token);

      setSuccessMsg("Signed Up Successfully!");
      setIsError(false);

      setTimeout(() =>   window.location.reload(), 1000);
    } catch (error) {
      setErrorMsg(error.message || "Network error. Please try again later.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };


const [showPassword, setShowPassword] = useState(false);
const [showPassword1, setShowPassword1] = useState(false);

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

  setErrors({
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`~+=]/.test(password),
  });
}, [password]);





const signUpFirst = (<>
          <div className={styles.signDiv}>
            <p className={styles.title}>Create Your Account</p>
                <label htmlFor="signupusername" className={styles.labelUsername}>Enter Username</label>
                <input id="signupusername" 
                type="text" 
                className={styles.username}  
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}  
                />

                <label htmlFor="signupemail" className={styles.labelEmail}>Enter Email Address</label>
                <input id="signupemail" 
                  type="email"
                className={styles.email}  
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  
                />

                <label htmlFor="signupfirstName" className={styles.labelFirstName}>First Name</label>
                <input id="signupfirstName" 
                type="text" 
                className={styles.firstName}  
                placeholder="Enter Your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}  
                />

                <label htmlFor="signuplastName" className={styles.labelLastName}>Last Name</label>
                <input id="signuplastName" 
                type="text" 
                className={styles.lastName}  
                placeholder="Enter Your Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}  
                />

                <div className={styles.pwCriteria}>
                <p className={styles.criteriaTitle}>Password must contain:</p>
                <ul>
                  <li className={errors.length ? styles.ok : styles.bad}>
                    {errors.length ? "✔" : "✖"} At least 8 characters
                  </li>
                  <li className={errors.lowercase ? styles.ok : styles.bad}>
                    {errors.lowercase ? "✔" : "✖"} Lowercase letter
                  </li>
                  <li className={errors.uppercase ? styles.ok : styles.bad}>
                    {errors.uppercase ? "✔" : "✖"} Uppercase letter
                  </li>
                  <li className={errors.number ? styles.ok : styles.bad}>
                    {errors.number ? "✔" : "✖"} Number (0-9)
                  </li>
                  <li className={errors.special ? styles.ok : styles.bad}>
                    {errors.special ? "✔" : "✖"} Special character (!@#$%)
                  </li>
                </ul>
              </div>

                <label htmlFor="signuppassword" className={styles.labelPassword}>Enter Password</label>
                <input id="signuppassword" 
                type={showPassword ? "text" : "password"}
                className={styles.password}  
                 placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 />

                <label htmlFor="signuppasswordagain" className={styles.labelPasswordAgain}>Enter Password Again</label>
                <input id="signuppasswordagain" 
                type={showPassword1 ? "text" : "password"}
                className={styles.passwordAgain}  
                 placeholder="Enter Password Again"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
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


                <button
                    className={styles.submit}
                    type="button"     onClick={() => {
                    if (!username || !email || !firstName || !lastName || !password || !passwordAgain) {
                      setErrorMsg("Please fill in all fields before continuing.");
                      setIsError(true);
                      setTimeout(() => setErrorMsg(""), 3000);
                      return;
                    }

                    const allGood = Object.values(errors).every(Boolean);
                    if (!allGood) {
                      setErrorMsg("Password does not meet requirements.");
                      setIsError(true);
                      setTimeout(() => setErrorMsg(""), 3500);
                      return;
                    }

                    setIsLoading(true);
                    setTimeout(() => {
                      setIsSecond(true);
                      setIsLoading(false);
                    }, 1000);
                  }}>
                    {isLoading ? (
                        <span className={styles.loader}></span>
                      ) : (
                        "Next"
                      )}</button>

                <p className={styles.subtitle}>Already have an account?</p>
                <Link className={styles.signnow}  onClick={() => {
                  setIsSign(false);
                  }}>Log in now!</Link> 

            </div>

</>);



const signUpSecond = (<>

         <div className={styles.signDiv}>
            <p className={styles.title}>Create Your Account</p>


                <label htmlFor="signupfirstName" className={styles.labelFirstName}>First Name</label>
                <input id="signupfirstName" 
                type="text" 
                className={styles.firstName}  
                placeholder="Enter Your First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}  
                />

              


                <button
                    className={styles.submit}
                    type="button" onClick={handleSignUp}
  >                      {isLoading ? (
                        <span className={styles.loader}></span>
                      ) : (
                        "Sign Up"
                      )}</button>

                <p className={styles.subtitle}>Already have an account?</p>
                <Link className={styles.signnow}  onClick={() => {
                  setIsSign(false);
                  }}>Log in now!</Link> 

            </div>



</>);



    return(<>
      <form onSubmit={handleSubmit}>
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
              <p className={styles.backgroundTitle}>Access Your Account</p>
              <p className={styles.backgroundSubtitle}>Sign in to continue exploring our amazing products.</p>
            <p></p>
          </div>
            <div
             className={styles.box}
            ref={boxRef}
             >
              {!isSign ? (<>

                  <div className={styles.logDiv}>
                    <p className={styles.title}>Log In to Your Account</p>
                    <label htmlFor="loginusername" className={styles.labelUsername}>Username</label>
                    <input id="loginusername" 
                    type="text" 
                    className={styles.username}  
                    placeholder="Enter Your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}  
                    />

                    <label htmlFor="loginpassword" className={styles.labelPassword}>Password</label>
                    <input id="loginpassword" 
                    type={showPassword ? "text" : "password"}
                    className={styles.password}  
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.toggleBtn}
                    >
                    {showPassword ? (

                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#333333ff">
                        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                        </svg>
                    ) : (

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
                        <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                        </svg>
                        )}
                    </button>


                    <Link className={styles.forgot} to="/forgot-password">Forgot Password?</Link>
                    <button
                        className={styles.submit}
                        type="submit">                      
                        {isLoading ? (
                          <span className={styles.loader}></span>
                        ) : (
                          "Login"
                        )}</button>
                    <p className={styles.subtitle}>Don't have an account yet?</p>
                    <Link className={styles.signnow}  onClick={() => {
                      setIsSign(true);
                      }}>Sign Up now!</Link> 
                </div>
                </>) : (<>
                {isSecond ? signUpSecond : signUpFirst}
                </>)}
          </div>
          
        </div>

        </form>
    </>)
}


export default Login