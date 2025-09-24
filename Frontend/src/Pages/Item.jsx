import { useParams } from "react-router-dom";
import {useEffect,useState} from "react";
import axios from "axios";
import Product from "../Components/Item/Item"
import Nav from "../Components/Nav/Nav"
import Footer from "../Components/Footer/Footer"

function Item({ shiftUp, setShiftUp }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    const { id } = useParams();
    const [item, setItem] = useState([]);

 useEffect(() => {
    const fetchAndUpdateItem = async () => {
      try {
        const response = await axios.get(
          `https://techstore-3fvk.onrender.com/api/v1/products/id/${id}`
        );
        const currentItem = response.data;
        setItem(currentItem);

        const updatedItem = {
          ...currentItem,
          searched: (currentItem.searched || 0) + 1,
        };

        await axios.put(
          "https://techstore-3fvk.onrender.com/api/v1/products/update",
          updatedItem
        );

        console.log(`✅ Item searched count updated to ${updatedItem.searched}`);
      } catch (error) {
        console.error("Error fetching or updating item:", error);
      }
    };

    fetchAndUpdateItem();
  }, [id]);




    return (<>
    <title>{"TechStore | " + item.name}</title>
    <Nav highlight={true}/>
    <Product name = {item.name} />
    <Footer />
    
    </>);
}


export default Item;