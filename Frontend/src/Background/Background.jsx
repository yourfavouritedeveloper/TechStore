
import styles from "./Background.module.css"
import { motion, useInView, useAnimation } from 'framer-motion';
import React, { useEffect, useRef, forwardRef } from 'react';

function Background() {
        const mainControls = useAnimation();
        const localRef = useRef(null);
        const isInView = useInView(localRef, { once: true });
        useEffect(() => {
            if (isInView) {
                mainControls.start("visible");
            }
        }, [isInView]);
    
    return (
        <>
        <div className={styles.container}>   
            <motion.div 
            className={styles.box}
            variants={{
                hidden: { y: "300px"},
                visible: { y: "0px" }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "10px" }}
            animate={mainControls}
            transition={{ duration: 1.5 }}   
            >

            </motion.div>
        </div>
        
   
        </>
        
    );
}


export default Background