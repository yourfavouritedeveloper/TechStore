import Nav from "../Components/Nav/Nav";
import AccountCart from "../Components/Cart/Cart"
import { useParams } from "react-router-dom";

function Cart() {
    const { username } = useParams();

    return (<>
        <title>{username + " | Shopping Cart"}</title>
        <Nav highlight={true} />
        <AccountCart />
    </>)
}

export default Cart;