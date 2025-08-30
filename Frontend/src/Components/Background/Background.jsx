
    import styles from "./Background.module.css"
    import { motion, useInView, useAnimation,useScroll, useTransform } from "framer-motion";
    import { useEffect, useRef, useState } from "react";
    import Campaign from "../Campaign/Campaign";
    import { Link  } from "react-router-dom";
    import backvideo from "../../assets/backvideo.mov"
    import campaignPhoto from "../../assets/campaign.png"
    import axios from "axios";


    function Background({shopRef,scrollTo, onShopClick}) {
    const videoRef = useRef(null);
    const [items, setItems] = useState([]);



    useEffect(() => {
    axios.get("https://techstore-3fvk.onrender.com/api/v1/products/all") 
      .then(response => {
        setItems(response.data.slice(0, 6));
        
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

    useEffect(() => {
      const checkVideo = () => {
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
        }
    };
        const interval = setInterval(checkVideo, 3000); 
        return () => clearInterval(interval);
        }, []);


    const circleRef1 = useRef(null)
    const circleRef2 = useRef(null)
    const boxRef = useRef(null);
    const moduleRef = useRef(null);
    const ref = useRef(null);
    const textRef = useRef(null)

    const circleControls1 = useAnimation();
    const circleControls2 = useAnimation();
    const boxControls = useAnimation();
    const moduleControls = useAnimation();
    const controls = useAnimation();
    const textControls = useAnimation();

    const circleInView1 = useInView(circleRef1, { once: true });
    const circleInView2 = useInView(circleRef2, { once: true });
    const boxInView = useInView(boxRef, { once: true });
    const moduleInView = useInView(moduleRef, { once: true });
    const inView = useInView(ref, { once: true });
    const textInView = useInView(textRef, {once : true})


  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY>1500) return;
      setOffset(window.scrollY); 
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { scrollY } = useScroll();

    const y = -200 + offset * 0.3;          
  const rotateZ = offset * 0.05;     
  const scale = 0.8 + offset * 0.0002;    
  const opacity = Math.min(offset / 10000, 1);
  const rotateX = Math.max((150- offset+300 * 0.35)*0.3, 0);
  const rotateY = Math.min(55 - offset * 0.01, 0);
  const left = useTransform(
    scrollY,
    [0, 1500],   
    ["37%", "0%"]  
  );
  

  


        function handleClick() {
            scrollTo?.(); 
            onShopClick?.();
    
        }

    useEffect(() => {
        if (boxInView) boxControls.start("visible");
        if (moduleInView) moduleControls.start("visible");
        if (inView) controls.start("visible");
        if (textInView) textControls.start("visible")
        if (circleInView1) circleControls1.start("visible")
        if (circleInView2) circleControls2.start("visible")

    }, [boxInView, moduleInView,inView,textInView,circleInView1,circleInView2]);
        
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
                viewport={{ margin: "0px" }}
                animate={textControls}
                transition={{ duration: 1}} 
                >
                    Welcome to Tech Store
                </motion.div>
                <div
                className={styles.line}
                >
                </div>



                <motion.div 
                ref={boxRef}
                className={styles.box}
                variants={{
                    hidden: { y: "100px"},
                    visible: { y: "0px" }
                }}
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
                    viewport={{ margin: "0px" }}
                    initial="hidden"
                    animate={boxControls}
                    transition={{ duration: 1}} 
                    onClick={handleClick}  
                    >SHOP NOW
                    </motion.button>





                </motion.div>
                <div className={styles.coverBox}>
                        <motion.div 
                        className={styles.circleBack1}
                        ref={circleRef1}
                            animate={circleControls1}
                        variants={{
                            hidden: {x: "800px"},
                            visible: {x: "0px"}
                            }}
                            initial="hidden"
                            viewport={{ margin: "0px" }}
                            transition={{ duration: 1.25}}
                            >
                        <motion.div 
                        className={styles.circleBack2}
                        ref={circleRef2}
                            animate={circleControls2}
                        variants={{
                            hidden: {x: "-800px"},
                            visible: {x: "0px"}
                            }}
                            initial="hidden"
                            viewport={{ margin: "0px" }}
                            transition={{ duration: 1.25}}
                            ></motion.div>
                            
                            </motion.div>
                          <motion.p className={styles.coverTitle}
                            style={{
                            transform: `translateY(${offset*0.85}px)`, 
                            transition: "all 0.5s ease",
                            fontSize:  `clamp(0rem, min(${3000/offset+1}vw,3.5vw), 3.5vw)`,
                            width: `min(max(${1280-offset}%,49%),66%)`,
                            opacity: `${offset*0.002}`,
                            left
                            }}
                        >                                                                       
                            Explore a wide range of tech products to suit every need!
                        </motion.p>
                </div>  
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
                    <Campaign />
                </motion.div>

                <motion.div
                className={styles.boxExplanation}
                style={{
                    transform: `
                    translateY(min(${y*0.3}px,7px)) 
                    rotateZ(max(${(30-rotateZ)*0.5}deg,0deg))
                    rotateX(${rotateX*1.1}deg)
                    rotateY(${rotateY-20}deg)
                    scale(min(${scale},0.9))
                    `,
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                    

                }}
                >
                
                <p className={styles.title}>Campaigns</p>
                <motion.div className={styles.boxCampaignExplanation}>
                    <img
                    className={styles.campaignPhoto}
                    src={campaignPhoto}
                    alt="Campaign Photo"
                    />
                    <p className={styles.subtitle}>
                    Don’t miss out on the most talked-about offers! These deals are gaining
                    serious attention — grab yours before they’re gone.
                    </p>
                    <Link className={styles.button} to="/campaign">
                    See Campaign
                    </Link>
                </motion.div>
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
                className={styles.box3}
                style={{
                    transform: `
                    translateX(${250-y}px) 
                    rotateZ(max(${(70 - rotateZ) * 0.5}deg,0deg))
                    rotateX(${rotateX * 0.5}deg)
                    rotateY(${rotateY-15}deg)
                    scale(min(${scale}, 0.9))
                    `,
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                    transition: "transform 0.3s ease-out",
                }}
                >
                <div className={styles.navdiv}></div>

                <div className={styles.accountdiv}>
                    <div className={styles.circle}></div>
                    <p className={styles.accountTitle}>Account</p>
                    <div className={styles.randomBox}></div>
                    <div className={styles.randomBox}></div>
                    <div className={styles.randomBox}></div>
                </div>

                <div className={styles.itemsdiv}>
                    <ul className={styles.items}>
                    {items.map((item) => (
                        <Link
                        key={item.name}
                        className={styles.item}
                        to={"/product/" + item.name}
                        >
                        <img src={item.productImageUrl} alt={item.name} />
                        <p className={styles.name}>{item.name}</p>
                        <p className={styles.guarantee}>{item.guarantee} month</p>
                        <span>{item.price}₼</span>
                        </Link>
                    ))}
                    </ul>
                </div>
                </motion.div>

                <motion.div
                ref={ref}
                className={styles.fadeOverlay}
                variants={{
                hidden: { opacity: 1 },
                visible: { opacity: 0.6 },
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