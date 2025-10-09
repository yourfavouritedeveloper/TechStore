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



    useEffect(() => {
    axios.get(`https://techstore-3fvk.onrender.com/api/v1/accounts/username/${account?.username}`,
    {
        auth: {
        username: USERNAME, 
        password: PASSWORD
        }
    }) 
      .then(response => {
        setLogAccount(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [account]);

    return (<>
        <title>{logAccount?.customerName  + " | Shopping Cart"}</title>
        <Nav highlight={true} />
        <AccountCart />
    </>)
}

export default Cart;