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
    axios.get(`https://techstore-3fvk.onrender.com/api/v1/products/id/${id}`) 
      .then(response => {
        setItem(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

    return (<>
    <title>{item.name}</title>
    <Nav highlight={true}/>
    <Product name = {item.name} />
    <Footer />
    
    </>);
}


export default Item;