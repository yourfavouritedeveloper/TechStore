import { useParams } from "react-router-dom";
import Product from "../Components/Item/Item"
import Nav from "../Components/Nav/Nav"
import Footer from "../Components/Footer/Footer"

function Item({ shiftUp, setShiftUp }) {

    const { name } = useParams();

    return (<>
    <title>{name}</title>
    <Nav highlight={true}/>
    <Product name = {name} />
    <Footer />
    
    </>);
}


export default Item;