import styles from "./CampaignAdd.module.css"
import { Link } from "react-router-dom";
import { useRef,useEffect } from "react";
import { motion, useScroll, useTransform,useAnimation,useInView } from "framer-motion";
import Phone from "../../assets/phone.png"

function CampaignAdd() {

    const ref = useRef(null);
    const circleRef = useRef(null);


    const inView = useInView(ref,{once:true});
    const circleInView = useInView(circleRef, { once: true });

    const controls =  useAnimation();
        useEffect(() => {
        if (inView) controls.start("visible");
    }, [inView]);

    const circleControls = useAnimation();
        useEffect(() => {
        if (circleInView) circleControls.start("visible");
    }, [circleInView]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], 

  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.4]);


    return (
        <>
            <div className={styles.container}>
                    <div
                        ref={ref}
                        className={styles.box}
                    >
                        <div className={styles.titleContainer}>
                        <p className={styles.title}
                        >
                            Don’t Miss Our Latest Campaigns!
                            
                        </p>
                        <p className={styles.subtitle}
                        
                        >
                            Exclusive deals, limited-time offers, and special discounts on your favorite products. Grab them before they’re gone!
                        </p>
                        </div>
                        <motion.div 
                                    className={styles.circle}
                                    ref={circleRef}
                                    animate={circleControls}
                                    variants={{
                                    hidden: {x: "-800px"},
                                    visible: {x: "0px"}
                                    }}
                                    initial="hidden"
                                    viewport={{ margin: "10px" }}
                                    transition={{ duration: 1.25}}
                        ></motion.div>
                        <div className={styles.imageContainer}>
                            <img
                                className={styles.photo90}
                                src={Phone}
                                alt=""
                            />
                        </div>
                        <div className={styles.subsubtitleContainer}>
                            <p className={styles.subsubtitle}>Click here to check latest Campaigns!</p>
                            <Link className={styles.button} to="/campaign">Shop Now</Link>
                        </div>
                    </div>
                    

            </div>
        
        </>
    );
}

export default CampaignAdd;