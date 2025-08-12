import styles from "./Login.module.css";
import { motion, useInView, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";

function Login() {

const circleRef1 = useRef(null);
const circleRef2 = useRef(null);
const boxRef = useRef(null);
const techStoreRef = useRef(null);

const circleInView1 = useInView(circleRef1, { once: true });
const circleInView2 = useInView(circleRef2, { once: true });
const boxInView = useInView(boxRef, { once: true });
const techStoreInView = useInView(techStoreRef, { once: true });

const controls1 = useAnimation();
const controls2 = useAnimation();
const boxControls = useAnimation();
const techStoreControls = useAnimation();

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


    
    return(<>
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
                <input id="username" type="text" className={styles.username}  placeholder="Enter Your Username" />

                <label htmlFor="password" className={styles.labelPassword}>Password</label>
                <input id="password" type="password" className={styles.password}   placeholder="Enter Your Password" />

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
    </>)
}


export default Login