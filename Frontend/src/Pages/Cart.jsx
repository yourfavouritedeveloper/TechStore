import Nav from "../Components/Nav/Nav";
import AccountCart from "../Components/Cart/Cart"
import { useParams } from "react-router-dom";
import { AuthContext } from "../Components/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Cart() {
    const { account, logout } = useContext(AuthContext);
    const [logAccount,setLogAccount] = useState({})
    const [cart, setCart] = useState({});



    useEffect(() => {
      const fetchData = async () => {
        try {
          const accountResponse = await axios.get(
            `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${account.username}`,
            { auth: { username: USERNAME, password: PASSWORD } }
          );

          setLogAccount(accountResponse.data);

          const cartResponse = await axios.get(
            `https://techstore-3fvk.onrender.com/api/v1/carts/account/${accountResponse.data.id}`,
            { auth: { username: USERNAME, password: PASSWORD } }
          );

          setCart(cartResponse.data);
        } catch (err) {
          console.error("Error fetching account or cart:", err);
        }
      };

      if (account?.username) {
        fetchData();
      }
    }, [account]);

    return (<>
        <title>{logAccount?.customerName  + " | Shopping Cart"}</title>
        <Nav highlight={true} />
        <AccountCart cart={cart} setCart={setCart} />
    </>)
}

export default Cart;