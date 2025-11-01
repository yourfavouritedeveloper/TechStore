import styles from "./Category.module.css";
import Table from "../../assets/table.png"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Monitor from "../../assets/categoryMonitor.png";
import Macbook from "../../assets/macbookCategory.png";

function Category({itemRef,scrollTo, onItemClick,onCategorySelect}) {

    const [isClicked,setIsClicked] = useState(false);
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
            <div className={styles.tableDiv}>
                <div className={styles.floorDiv}></div>
                <img className={styles.table} src={Table} alt="" />

                <div className={isClicked ? styles.clicked : styles.not}></div>
                <div className={isClicked && clickedName == "monitor" ? styles.monitorDiv : styles.notMonitor}>
                    <p className={styles.title}>Monitors</p>
                    <button onClick={() => handleClick("MONITOR")}>Check Monitors</button>

                </div>
                <img 
                className={isClicked && clickedName == "monitor" ? styles.monitorClicked : styles.monitor} 
                src={Monitor} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "monitor" ? "" : "monitor");
                }} 
                alt="" 
                />


                <div className={isClicked && clickedName == "computer" ? styles.computerDiv : styles.notComputer}>
                <p className={styles.title}>Computers</p>
                    <button onClick={() => handleClick("COMPUTER")}>Check Computers</button>

                </div>
                <img 
                className={isClicked && clickedName == "computer" ? styles.computerClicked : styles.computer} 
                src={Macbook} 
                onClick={() => {
                    setIsClicked(!isClicked);
                    setClickedName(clickedName == "computer" ? "" : "computer");
                }} 
                alt="" 
                />
            </div>
        </div>
    </>);
}

export default Category;