import styles from "./Item.module.css"
import axios from "axios";
import { useState, useEffect } from "react";

function Item({name}) {

    const [item,setItem] = useState([])

    useEffect(() => {
    axios.get(`https://techstore-3fvk.onrender.com/api/v1/products/${name}`) 
      .then(response => {
        setItem(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

    return(<>
    <div>
        {item.name}
    </div>

    
    </>);
}


export default Item;