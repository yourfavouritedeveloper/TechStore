import { useParams } from "react-router-dom";

function Item({ shiftUp, setShiftUp }) {

    const { name } = useParams();

    return (<>
    <title>{name}</title>
    
    </>);
}


export default Item;