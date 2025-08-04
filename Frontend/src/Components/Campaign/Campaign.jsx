import styles from "./Campaign.module.css"
import React, { useState, useEffect, useRef } from 'react';
import Iphone from "../../assets/iphone.png";

const totalSlides = 3;

function Campaign() {

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);


  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % totalSlides);
    }, 5000);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % totalSlides);
    startAutoSlide();
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    startAutoSlide();
  };


    return(
        <>
            <div className={styles.container}>
              <div className={styles.slider}
               style={{ transform: `translateX(-${index * 100}%)` }}> 
                    <div className={styles.campaign1}>
                        <div className={styles.inner}></div>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>
                        <div className={styles.circle3}></div>     
                        <p className={styles.title}>50% OFF REGISTRATION</p>
                        <p className={styles.subtitle}>Don't miss your chance to get started for half the price!</p>
                        <p className={styles.subsubtitle}>Register now and level up your journey!</p>
                    </div>
                    <div className={styles.campaign2}>
                        <div className={styles.inner}></div>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>
                        <div className={styles.circle3}></div>     
                        <p className={styles.title}>30% OFF</p>
                        <p className={styles.subtitle}>Limited-time deal on iPhones, Macs, and more!</p>
                        <p className={styles.subsubtitle}>Shop now and save big on premium tech.</p>
                        <img src={Iphone} alt="iphone" />
                        <button>Shop Now</button>
                    </div>
                    <div className={styles.campaign3}></div>      
                </div>    
                <div className={styles.controls}>
                    <button onClick={prevSlide}>←</button>
                    <button onClick={nextSlide}>→</button>
                </div>     
            </div>
        </>

    );
}

export default Campaign