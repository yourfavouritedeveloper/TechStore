import { useParams } from "react-router-dom";
import Product from "../Components/Item/Item"

function Item({ shiftUp, setShiftUp }) {

    const { name } = useParams();

    return (<>
    <title>{name}</title>
    <Product name = {name} />
    
    </>);
}


export default Item;