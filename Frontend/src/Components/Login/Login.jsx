import styles from "./Login.module.css";
import { motion, useInView, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState,useContext  } from "react";
import { Link,useNavigate  } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Login() {

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


  const { login } = useContext(AuthContext);


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

const handleSubmit =async  (e) => {
  e.preventDefault();
  setErrorMsg("");
  try {
      const response = await fetch("https://techstore-3fvk.onrender.com/api/v1/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMsg(errorText || "Login failed. Please check your credentials.");
        setIsError(true);
        return;
      }
      const data = await response.text();
      login(data);
      localStorage.setItem("authToken", data.token);
      setErrorMsg("Login Successful!");
      setIsError(false);

        setTimeout(() => {
            navigate("/");
        }, 1500);
    } catch (error) {
      setErrorMsg("Network error. Please try again later.");
      setIsError(true);
    }

};


const [showPassword, setShowPassword] = useState(false);

    
    return(<>
      <form onSubmit={handleSubmit}>
        <div className={styles.container}>
            <motion.div 
            className={styles.circle1}
            ref={circleRef1}
            animate={controls1}
            variants={{
            hidden: {x: "-800px"},
            visible: {x: "0px"}
            }}
            initial="hidden"
            viewport={{ margin: "10px" }}
            transition={{ duration: 1.25}}
            >

            </motion.div>

            <motion.div 
            className={styles.circle2}
            ref={circleRef2}
            animate={controls2}
            variants={{
            hidden: {x: "800px"},
            visible: {x: "0px"}
            }}
            initial="hidden"
            viewport={{ margin: "10px" }}
            transition={{ duration: 1.25}}
            >
            </motion.div>
            <motion.div
             className={styles.box}
            ref={boxRef}
            animate={boxControls}
            variants={{
            hidden: { 
                x: -300
            },
            visible: { 
                x:0
            }
            }}
            initial="hidden"

            viewport={{ margin: "10px" }}
            transition={{
                duration: 1
            }}
             >
                <p className={styles.title}>Log In to Your Account</p>
                <label htmlFor="username" className={styles.labelUsername}>Username</label>
                <input id="username" 
                type="text" 
                className={styles.username}  
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}  
                />

                <label htmlFor="password" className={styles.labelPassword}>Password</label>
                <input id="password" 
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

                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333333ff">
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                    </svg>
                ) : (

                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#333333ff">
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                    </svg>
                    )}
                </button>


                <Link className={styles.forgot} to="/forgot-password">Forgot Password?</Link>
                <button
                    className={styles.submit}
                    type="submit">Log In</button>
                <p className={styles.subtitle}>Don't have an account yet?</p>
                <Link className={styles.signnow} to="/signup">Sign Up now!</Link>                 {errorMsg && <p className={isError ? styles.errorMsg : styles.safeMsg}>{errorMsg}</p> }

            </motion.div>
            <motion.div
             className={styles.techStore}
            ref={techStoreRef}
            animate={techStoreControls}
            variants={{
            hidden: { 
                x: 300,        

            },
            visible: { 
                x: 0,

            }
            }}
            initial="hidden"

            viewport={{ margin: "10px" }}
            transition={{
                duration: 1
            }}
             >


            </motion.div>
        </div>

        </form>
    </>)
}


export default Login