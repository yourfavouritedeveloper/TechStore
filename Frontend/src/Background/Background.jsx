
import styles from "./Background.module.css"
import { motion, useInView, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";
import Module from "../Model/Module";

function Background() {
  const boxRef = useRef(null);
  const moduleRef = useRef(null);
  const ref = useRef(null);

  const boxControls = useAnimation();
  const moduleControls = useAnimation();
  const controls = useAnimation();

  const boxInView = useInView(boxRef, { once: true });
  const moduleInView = useInView(moduleRef, { once: true });
  const inView = useInView(ref, { once: true });


  useEffect(() => {
    if (boxInView) boxControls.start("visible");
    if (moduleInView) moduleControls.start("visible");
    if (inView) controls.start("visible");
  }, [boxInView, moduleInView,inView]);
    
    return (
        <>
        <div className={styles.container}>   
            <motion.div 
            ref={boxRef}
            className={styles.box}
            variants={{
                hidden: { y: "280px"},
                visible: { y: "0px" }
            }}
            viewport={{ margin: "10px" }}
            initial="hidden"
            animate={boxControls}
            transition={{ duration: 1.5,delay:2 }}   
            >

            </motion.div>
            <motion.div className={styles.module}
            ref={moduleRef}
            variants={{
                hidden: { opacity:1},
                visible: { opacity:1}
            }}
            initial="hidden"
            viewport={{ margin: "10px" }}
            animate={moduleControls}
            transition={{ duration: 1.5 }} 
                         
            >
                <Module />

            <motion.div
            ref={ref}
            className={styles.fadeOverlay}
            variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 0 },
            }}
            initial="hidden"
            animate={controls}
            transition={{ duration:5,delay:2}}
            />
            </motion.div>
            
            <motion.div
            className={styles.title}>
                <p>Welcome</p>
            </motion.div>
        </div>
        
   
        </>
        
    );
}


export default Background