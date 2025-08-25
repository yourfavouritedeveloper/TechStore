
    import styles from "./Background.module.css"
    import { motion, useInView, useAnimation } from "framer-motion";
    import { useEffect, useRef } from "react";
    import Campaign from "../Campaign/Campaign";
    import { Link  } from "react-router-dom";
    import backvideo from "../../assets/backvideo.mov"



    function Background({shopRef,scrollTo, onShopClick}) {
    const videoRef = useRef(null);

    useEffect(() => {
    const startVideo = () => {
        videoRef.current?.play();
    };
    
    window.addEventListener('mousemove', startVideo, { once: true });
    window.addEventListener('touchstart', startVideo, { once: true });

    return () => {
        window.removeEventListener('mousemove', startVideo);
        window.removeEventListener('touchstart', startVideo);
    };
    }, []);



    const boxRef = useRef(null);
    const moduleRef = useRef(null);
    const ref = useRef(null);
    const textRef = useRef(null)

    const boxControls = useAnimation();
    const moduleControls = useAnimation();
    const controls = useAnimation();
    const textControls = useAnimation();

    const boxInView = useInView(boxRef, { once: true });
    const moduleInView = useInView(moduleRef, { once: true });
    const inView = useInView(ref, { once: true });
    const textInView = useInView(textRef, {once : true})


        function handleClick() {
            scrollTo?.(); 
            onShopClick?.();
    
        }

    useEffect(() => {
        if (boxInView) boxControls.start("visible");
        if (moduleInView) moduleControls.start("visible");
        if (inView) controls.start("visible");
        if (textInView) textControls.start("visible")
    }, [boxInView, moduleInView,inView,textInView]);
        
        return (
            <>
            <div className={styles.container}>   
                <motion.div
                className={styles.title}
                ref={textRef}
                variants={{
                    hidden: { opacity:0,y: "50px",filter: "blur(12px)"},
                    visible: { opacity:0.8,y: "0px",filter: "blur(0px)"}
                }}
                initial="hidden"
                viewport={{ margin: "10px" }}
                animate={textControls}
                transition={{ duration: 1}} 
                >
                    Welcome
                </motion.div>
                <motion.div 
                ref={boxRef}
                className={styles.box}
                variants={{
                    hidden: { y: "100px"},
                    visible: { y: "0px" }
                }}
                viewport={{ margin: "10px" }}
                initial="hidden"
                animate={boxControls}
                transition={{ duration: 1}}   
                >


                    <motion.p
                    ref={boxRef}
                    className={styles.subtitle}
                    variants={{
                        hidden: { opacity: 0},
                        visible: { opacity: 1 }
                    }}
                    viewport={{ margin: "10px" }}
                    initial="hidden"
                    animate={boxControls}
                    transition={{ duration: 2 }}                 
                    >At TechStore, you’ll find a wide selection of the latest tech products, from smartphones and laptops to everyday accessories, all in one easy-to-use website. 
                    </motion.p>


                    <motion.button 
                    ref={shopRef}
                    className={styles.shop}
                    variants={{
                        hidden: { opacity: 0},
                        visible: { opacity: 1 }
                    }}
                    viewport={{ margin: "10px" }}
                    initial="hidden"
                    animate={boxControls}
                    transition={{ duration: 1}} 
                    onClick={handleClick}  
                    >SHOP NOW
                    </motion.button>





                </motion.div>
                <motion.div 
                ref={boxRef}
                className={styles.boxCampaign}
                variants={{
                    hidden: { y: "100px"},
                    visible: { y: "0px" }
                }}
                viewport={{ margin: "10px" }}
                initial="hidden"
                animate={boxControls}
                transition={{ duration: 1}}   
                >
                    <p className={styles.title}>Trending Now</p>
                    <Campaign />
                    <p className={styles.subtitle}>Don’t miss out on the most talked-about offers! These deals are gaining serious attention — grab yours before they’re gone.</p>
                    <Link className={styles.button} to="/campaign">See Campaign</Link>
                </motion.div>
                <video className={styles.video} autoPlay loop muted playsInline preload="auto">
                    <source src={backvideo} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
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
                

                <motion.div
                ref={ref}
                className={styles.fadeOverlay}
                variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 0.2 },
                }}
                initial="hidden"
                animate={controls}
                transition={{ duration:5,delay:1}}
                />
                </motion.div>
                <motion.div
                ref={ref}
                className={styles.blurOverlay}
                variants={{
                hidden: { backdropFilter: "blur(12px)" },
                visible: {  backdropFilter: "blur(0px)"},
                }}
                initial="hidden"
                animate={controls}
                transition={{ duration:1}}
                />
                

            </div>
            
    
            </>
            
        );
    }


    export default Background