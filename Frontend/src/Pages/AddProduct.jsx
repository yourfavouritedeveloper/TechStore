import { useState } from "react";
import AddItem from "../Components/AddItem/AddItem";
import Nav from "../Components/Nav/Nav";
import { useParams } from "react-router-dom"; 


function AddProduct() {

    const [highlight, setHighlight] = useState(false)
    const { username } = useParams();

    return(<>
    <title>Add a new Product</title>
        <Nav highlight={highlight} setHighlight={setHighlight}/>
        <AddItem highlight={highlight} setHighlight={setHighlight}  username={username}/>
    
    </>);
}


export default AddProduct;