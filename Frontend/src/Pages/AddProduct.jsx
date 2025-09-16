import { useState } from "react";
import AddItem from "../Components/AddItem/AddItem";
import Nav from "../Components/Nav/Nav";



function AddProduct() {

    const [highlight, setHighlight] = useState(false)

    return(<>
    <title>Add a new Product</title>
        <Nav highlight={highlight} setHighlight={setHighlight}/>
        <AddItem highlight={highlight} setHighlight={setHighlight}/>
    
    </>);
}


export default AddProduct;