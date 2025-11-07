import styles from "./Category.module.css";
import Table from "../../assets/table.png"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Monitor from "../../assets/categoryMonitor (1).png";
import Macbook from "../../assets/macbookCategory.png";
import Iphone from "../../assets/iphoneCategory.png";
import Keyboard from "../../assets/keyboard.png";
import HeadphoneStand from "../../assets/headphoneStand.png";
import Headphone from "../../assets/headphone.png";
import TvTable from "../../assets/tvTable.png";
import Tv from "../../assets/tv.png";
import Soft from "../../assets/soft.png";
import Tablet from "../../assets/tabletCategory.png";
import Watch from "../../assets/watch.png";

function Category({itemRef,scrollTo, onItemClick,onCategorySelect}) {

    const [isClicked,setIsClicked] = useState(false);
    const [hoveredName,setHoveredName] = useState();
    const [clickedName,setClickedName] = useState();

      const navigate = useNavigate(null);
      

        function handleClick(category) {
            scrollTo?.();
            onItemClick?.();
            navigate("/product", { state: { category } })
            onCategorySelect?.(category);
        }

    return(<>
        <div className={styles.container}  ref={itemRef}>
            <div className={styles.backgroundDiv}></div>
            <div className={styles.floorbackgroundDiv}></div>
            <div className={styles.tableDiv}>
                <p className={styles.mainTitle}>Categories</p>
                <p className={styles.subtitle}>Browse through our curated collection of products. Each category is tailored to help you quickly discover the best options for your needs.</p>
                <div className={styles.floorDiv}></div>
                <img className={styles.table} src={Table} alt="" />

                <div className={isClicked ? styles.clicked : styles.not}></div>
                <div className={isClicked && clickedName == "monitor" ? styles.monitorDiv : styles.notMonitor}>
                    <p className={styles.title}>Monitors</p>
                    <p className={styles.descTitle}>Computers & Techs.</p>
                    <button onClick={() => handleClick("MONITOR")}>Check Monitors →</button>

                </div>
                <img 
                className={isClicked && clickedName == "monitor" ? styles.monitorClicked : styles.monitor} 
                style={{pointerEvents: clickedName == "keyboard" ? "none" : ""}}
                src={Monitor} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "monitor" ? "" : "monitor");
                }} 
                onMouseEnter={() => setHoveredName("monitor")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />


                <div className={isClicked && clickedName == "computer" ? styles.computerDiv : styles.notComputer}>
                <p className={styles.title}>Computers</p>
                <p className={styles.descTitle}>Computers & Techs.</p>
                    <button onClick={() => handleClick("COMPUTER")}>Check Computers →</button>

                </div>
                <img 
                className={isClicked && clickedName == "computer" ? styles.computerClicked : styles.computer} 
                src={Macbook} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "computer" ? "" : "computer");
                }} 
                onMouseEnter={() => setHoveredName("computer")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />


                <div className={isClicked && clickedName == "phone" ? styles.phoneDiv : styles.notPhone}>
                <p className={styles.title}>Phones</p>
                <p className={styles.descTitle}>Mobile Phones & Tablets.</p>
                    <button onClick={() => handleClick("MOBILE_PHONE")}>Check Phones →</button>

                </div>
                <img 
                className={isClicked && clickedName == "phone" ? styles.phoneClicked : styles.phone} 
                src={Iphone} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "phone" ? "" : "phone");
                }} 
                onMouseEnter={() => setHoveredName("phone")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />



                
                <div className={isClicked && clickedName == "keyboard" ? styles.keyboardDiv : styles.notKeyboard}>
                <p className={styles.title}>Keyboards</p>
                <p className={styles.descTitle}>Computer Accessories</p>
                    <button onClick={() => handleClick("KEYBOARD")}>Check Keyboards →</button>

                </div>
                <img 
                className={isClicked && clickedName == "keyboard" ? styles.keyboardClicked : styles.keyboardOf} 
                style={{pointerEvents: clickedName == "monitor" ? "none" : ""}}
                src={Keyboard} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "keyboard" ? "" : "keyboard");
                }} 
                onMouseEnter={() => setHoveredName("keyboard")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />

                <img className={styles.headphoneStand} src={HeadphoneStand} alt="" />


                <div className={isClicked && clickedName == "headphone" ? styles.headphoneDiv : styles.notHeadphone}>
                <p className={styles.title}>Headphones</p>
                <p className={styles.descTitle}>Computer Accessories</p>
                    <button onClick={() => handleClick("HEADPHONE")}>Check Headphones →</button>

                </div>
                <img 
                className={isClicked && clickedName == "headphone" ? styles.headphoneClicked : styles.headphone} 
                src={Headphone} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "headphone" ? "" : "headphone");
                }} 
                onMouseEnter={() => setHoveredName("headphone")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />






                <img className={styles.tvTable} src={TvTable} alt="" />

                <div className={isClicked && clickedName == "tv" ? styles.tvDiv : styles.notTv}>
                <p className={styles.descTitle}>Tech. Accessories</p>
                <p className={styles.title}>TVs</p>
                    <button onClick={() => handleClick("TV")}>Check TVs →</button>

                </div>
                <img 
                className={isClicked && clickedName == "tv" ? styles.tvClicked : styles.tv} 
                src={Tv} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "tv" ? "" : "tv");
                }} 
                onMouseEnter={() => setHoveredName("tv")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />


                <img className={styles.soft} src={Soft} alt="" />





                <div className={isClicked && clickedName == "tablet" ? styles.tabletDiv : styles.notTablet}>
                <p className={styles.title}>Tablets</p>
                <p className={styles.descTitle}>Mobile Phones & Tablets.</p>
                    <button onClick={() => handleClick("TABLET")}>Check Tablets →</button>

                </div>
                <img 
                className={isClicked && clickedName == "tablet" ? styles.tabletClicked : styles.tablet} 
                src={Tablet} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "tablet" ? "" : "tablet");
                }} 
                onMouseEnter={() => setHoveredName("tablet")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />






                <div className={isClicked && clickedName == "watch" ? styles.watchDiv : styles.notWatch}>
                <p className={styles.title}>Watches</p>
                <p className={styles.descTitle}>Tech. Accessories</p>
                    <button onClick={() => handleClick("SMART_WATCH")}>Check Watches →</button>

                </div>
                <img 
                className={isClicked && clickedName == "watch" ? styles.watchClicked : styles.watch} 
                src={Watch} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "watch" ? "" : "watch");
                }} 
                onMouseEnter={() => setHoveredName("watch")}
                onMouseLeave={() => {
                    if (!isClicked) setHoveredName("");
                }}
                alt="" 
                />


                
            </div>
        </div>
    </>);
}

export default Category;