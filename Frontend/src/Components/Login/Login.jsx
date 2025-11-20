import styles from "./Login.module.css";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import BrandLogo from "../../../public/brandlogowhite.png"
import Mixed from "../../assets/mixed.png"
import axios from "axios";


function Login() {




  const [isForgot, setIsForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecond, setIsSecond] = useState(false);
  const circleRef1 = useRef(null);
  const circleRef2 = useRef(null);
  const boxRef = useRef(null);
  const techStoreRef = useRef(null);
  const submitRef = useRef(null);
  const [requestOtp, setRequestOtp] = useState();
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

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
    let timer;
    if (isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const handleResendOtp = async () => {
    setIsLoading(true);
    setIsResendDisabled(true);
    try {
      const otpResponse = await axios.put(
        `https://techstore-3fvk.onrender.com/api/v1/accounts/otp/send`,
        null,
        { params: { email } }
      );
      setSuccessMsg(otpResponse.data);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("OTP error:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to send OTP");
      setIsError(true);
      setIsResendDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

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


  const { login, logout, token, refreshToken, refreshAccessToken } = useContext(AuthContext);

  const location = useLocation();
  const sign = location.state?.sign || false;

  const [username, setUsername] = useState("");
  const [recoveryMail, setRecoveryMail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const from = location.state?.from?.pathname || "/";
  const [isSign, setIsSign] = useState(sign);



  useEffect(() => {
    if (!token) {
      refreshAccessToken();
    }
  }, [token, refreshAccessToken]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/accounts/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      const token = data.token || data.jwt || data.accessToken;
      const refreshToken = data.refreshToken;
      const account = data.account || data.user || { username };

      if (!token) throw new Error("No token received from server");

      login(account, token, refreshToken);
      localStorage.setItem("authToken", token);

      setSuccessMsg("Login Successful!");
      setIsError(false);

      setTimeout(() => navigate(from, { replace: true }), 1000);

    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string" && error.response.data) ||
        error.message ||
        "Network error. Please try again.";

      setErrorMsg(errMsg);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!recoveryMail) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.put(
        `https://techstore-3fvk.onrender.com/api/v1/accounts/recovery/password`,
        null,
        { params: { email: recoveryMail } }
      );

      setSuccessMsg("Recovery mail sent successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Error sending recovery email:", error);
      if (error.response?.status === 404) {
        setErrorMsg("No account found with this email.");
      } else {
        setErrorMsg("Failed to send recovery email. Try again later.");
      }
      setTimeout(() => setErrorMsg(""), 3000);
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
      const verifyResp = await axios.put(
        "https://techstore-3fvk.onrender.com/api/v1/accounts/otp/verify",
        null,
        { params: { email, requestOtp } }
      );
      if (!verifyResp.data) throw new Error("Invalid OTP. Please check the code sent to your email.");

      const signupResp = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/accounts/register",
        {
          customerName: `${firstName} ${lastName}`,
          username,
          password,
          email
        }
      );

      if (signupResp.status !== 201) {
        throw new Error(signupResp.data?.message || "Sign up failed.");
      }

      const loginResp = await axios.post(
        "https://techstore-3fvk.onrender.com/api/v1/accounts/login",
        { username, password }
      );

      const tokenSign = loginResp.data.token || loginResp.data.jwt || loginResp.data.accessToken;
      const refreshTokenSign = loginResp.data.refreshToken;
      const accountSign = loginResp.data.account || loginResp.data.user || { username };

      if (!tokenSign) throw new Error("No token received from server");

      login(accountSign, tokenSign, refreshTokenSign);

      setSuccessMsg("Signed Up Successfully!");
      setIsError(false);
      setTimeout(() => navigate(from, { replace: true }), 1000);

    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string" && error.response.data) ||
        error.message ||
        "Network error. Please try again later.";
      setErrorMsg(errMsg);
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


  const checkAvailability = async (username, email) => {
    try {
      const usernameRes = await fetch(
        `https://techstore-3fvk.onrender.com/api/v1/accounts/available/username?username=${encodeURIComponent(username)}`
      );
      const usernameAvailable = await usernameRes.json();
      if (!usernameAvailable) {
        setErrorMsg("");
        return {
          ok: false,
          message: "Username is already taken."
        };
      };

      const emailRes = await fetch(
        `https://techstore-3fvk.onrender.com/api/v1/accounts/available/email?email=${encodeURIComponent(email)}`
      );
      const emailAvailable = await emailRes.json();
      if (!emailAvailable) {
        return {
          ok: false,
          message: "Email is already registered."
        }
      };

      return { ok: true };
    } catch (err) {
      return { ok: false, message: "Error checking username/email. Please try again." };
    }
  };


  const signUpFirst = (<>
    <div className={styles.signDiv}>
      <p className={styles.title}>Create Your Account</p>
      <label htmlFor="signupusername" className={styles.labelUsername}>Enter Username</label>
      <input id="signupusername"
        type="text"
        maxLength={50}
        className={styles.username}
        placeholder="Enter Your Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="signupemail" className={styles.labelEmail}>Enter Email Address</label>
      <input id="signupemail"
        type="email"
        maxLength={60}
        className={styles.email}
        placeholder="Enter Your Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="signupfirstName" className={styles.labelFirstName}>First Name</label>
      <input id="signupfirstName"
        type="text"
        maxLength={50}
        className={styles.firstName}
        placeholder="Enter Your First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <label htmlFor="signuplastName" className={styles.labelLastName}>Last Name</label>
      <input id="signuplastName"
        type="text"
        maxLength={50}
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
        maxLength={50}
        className={styles.password}
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label htmlFor="signuppasswordagain" className={styles.labelPasswordAgain}>Enter Password Again</label>
      <input id="signuppasswordagain"
        type={showPassword1 ? "text" : "password"}
        maxLength={50}
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

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
          </svg>
        ) : (

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
            <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
          </svg>
        )}
      </button>


      <button
        type="button"
        onClick={() => setShowPassword1(!showPassword1)}
        className={styles.toggleBtn2}
      >
        {showPassword1 ? (

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
          </svg>
        ) : (

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
            <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
          </svg>
        )}
      </button>


      <button
        className={styles.submit}
        type="button" onClick={async () => {
          console.log("Next button clicked");

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

          const availability = await checkAvailability(username, email);
          if (!availability.ok) {
            setErrorMsg(availability.message);
            setIsError(true);
            setIsLoading(false);
            setTimeout(() => setErrorMsg(""), 3500);
            return;
          }



          try {
            const otpResponse = await axios.put(
              `https://techstore-3fvk.onrender.com/api/v1/accounts/otp/send`,
              null,
              {
                params: { email: email }
              }
            );

            setSuccessMsg(otpResponse.data);
            setTimeout(() => setSuccessMsg(""), 3500);
            setIsSecond(true);
            setIsResendDisabled(true);

          } catch (err) {
            console.error("OTP error:", err);
            setErrorMsg(err.response?.data?.message || err.message || "Failed to send OTP");
            setIsError(true);
          } finally {
            setIsLoading(false);

          }
        }}>
        {isLoading ? (
          <span className={styles.loader}></span>
        ) : (
          "Next"
        )}</button>

      <p className={styles.subtitle}>Already have an account?</p>
      <Link className={styles.signnow} onClick={() => {
        setIsSign(false);
      }}>Log in now!</Link>

    </div>

  </>);



  const signUpSecond = (<>

    <div className={styles.signDiv}>
      <p className={styles.secondTitle}>Email Verification</p>
      <p className={styles.secondSubtitle}>We’ve sent a 6-digit verification code to your email address. Please enter it below to verify your account.</p>


      <label htmlFor="otpCode" className={styles.labelOtp}>Verification Code</label>
      <input
        id="otpCode"
        type="text"
        maxLength={50}
        className={styles.otp}
        placeholder="Enter 6-digit code"
        value={requestOtp}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,6}$/.test(value)) {
            setRequestOtp(value);
          }
        }}
        pattern="^\d{6}$"
        title="Please enter exactly 6 digits"

      />




      <button
        className={styles.submitSignUp}
        type="button" onClick={handleSignUp}
      >                      {isLoading ? (
        <span className={styles.loader}></span>
      ) : (
        "Verify and Sign Up"
      )}</button>

      <button
        className={styles.submitResend}
        type="button"
        onClick={handleResendOtp}
        disabled={isResendDisabled || isLoading}
      >
        {isResendDisabled ? `Resend in ${countdown}s` :
          (isLoading ? <span className={styles.loader}></span> : "Resend Verification Code")}
      </button>

      <p className={styles.subtitle}>Already have an account?</p>
      <Link className={styles.signnow} onClick={() => {
        setIsSign(false);
      }}>Log in now!</Link>

    </div>



  </>);



  return (<>
    <form onSubmit={handleSubmit}>
      <div
        className={styles.container}
      >

        <p
          className={styles.errorMsg}
          style={{ top: !errorMsg ? "2.4rem" : "-7rem" }}
        >
          a{errorMsg}
        </p>

        <p
          className={styles.safeMsg}
          style={{ top: !successMsg ? "2.4rem" : "-7rem" }}

        >
          {successMsg}
        </p>

        <div className={styles.backgroundDiv}>
          <p className={styles.backgroundTitle} style={{ lineHeight: isForgot ? "0.9" : "0.9" }}>{isForgot ? "Forgot Your Password?" : "Access Your Account"}</p>
          <p className={styles.backgroundSubtitle}>{isForgot ? "You can change your password by typing the email connected to the account" : "Sign in to continue exploring our amazing products"}</p>
          <p></p>
        </div>
        <div
          className={styles.box}
          ref={boxRef}
        >
          <div className={styles.headerContainer}>
            <div className={styles.headerInner}>
              <button type="button" className={styles.backButton} onClick={() => navigate(from, { replace: true })}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.backIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Back</span>
              </button>
            </div>
          </div>
          {!isSign ? (<>

            {!isForgot ? (<>
              <div className={styles.logDiv}>
                <p className={styles.title}>Log In to Your Account</p>
                <label htmlFor="loginusername" className={styles.labelUsername}>Username</label>
                <input id="loginusername"
                  type="text"
                  maxLength={50}
                  className={styles.username}
                  placeholder="Enter Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="loginpassword" className={styles.labelPassword}>Password</label>
                <input id="loginpassword"
                  maxLength={50}
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

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
                      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    </svg>
                  ) : (

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#333333ff">
                      <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                    </svg>
                  )}
                </button>


                <Link className={styles.forgot} onClick={() => setIsForgot(true)}>Forgot Password?</Link>
                <button
                  className={styles.submit}
                  type="submit">
                  {isLoading ? (
                    <span className={styles.loader}></span>
                  ) : (
                    "Login"
                  )}</button>
                <p className={styles.subtitle}>Don't have an account yet?</p>
                <Link className={styles.signnow} onClick={() => {
                  setIsSign(true);
                }}>Sign Up now!</Link>
              </div>
            </>) : (<>
              <div className={styles.logDiv}>
                <p className={styles.recoveryTitle}>Change Your Password</p>
                <input id="email"
                  type="text"
                  maxLength={50}
                  className={styles.recoveryMail}
                  placeholder="Enter Your Email"
                  value={recoveryMail}
                  onChange={(e) => setRecoveryMail(e.target.value)}
                />

                <Link className={styles.forgot} onClick={() => setIsForgot(false)}>Go back to Login</Link>
                <button
                  type="button"
                  className={styles.submitForgot}
                  onClick={sendEmail}>
                  {isLoading ? (
                    <span className={styles.loader}></span>
                  ) : (
                    "Send Recovery Mail"
                  )}</button>
              </div>
            </>)}
          </>) : (<>
            {isSecond ? signUpSecond : signUpFirst}
          </>)}
        </div>

      </div>

    </form>
  </>)
}


export default Login