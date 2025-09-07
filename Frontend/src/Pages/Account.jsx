import Nav from "../Components/Nav/Nav";
import Profile from "../Components/Account/Account";
import { useParams } from "react-router-dom";
import {useEffect,useState} from "react";
import axios from "axios";


function Account() {

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    window.onbeforeunload = () => window.scrollTo(0, 0);
    }, []);

    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;

    const { username } = useParams();

    const [account, setAccount] = useState([]);

    useEffect(() => {
    axios.get(`https://techstore-3fvk.onrender.com/api/v1/accounts/username/${username}`,
    {
        auth: {
        username: USERNAME, 
        password: PASSWORD
        }
    }) 
      .then(response => {
        setAccount(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [username]);

    return (
        <>
        <title>{"Account | " + account.customerName}</title>
        <Nav></Nav>
        <Profile account={account} />
        </>
    );
}


export default Account;