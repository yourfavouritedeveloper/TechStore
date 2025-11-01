import styles from "./Category.module.css";
import Table from "../../assets/table.png"

function Category({itemRef,scrollTo, onItemClick,onCategorySelect}) {

    return(<>
        <div className={styles.container}  ref={itemRef}>
            <div className={styles.tableDiv}>
                <div className={styles.floorDiv}></div>
                <img className={styles.table} src={Table} alt="" />
            </div>
        </div>
    </>);
}

export default Category;