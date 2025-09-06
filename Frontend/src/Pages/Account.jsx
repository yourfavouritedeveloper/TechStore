import Nav from "../Components/Nav/Nav";
import Profile from "../Components/Account/Account";
import { useParams } from "react-router-dom";
import {useEffect,useState} from "react";

function Account() {

    const username = useParams();

    const [account, setAccount] = useState([]);

    useEffect(() => {
    axios.get(`https://techstore-3fvk.onrender.com/api/v1/accounts/username/${username}`) 
      .then(response => {
        setAccount(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [username]);

    return (
        <>
        <Nav highlight={true}></Nav>
        <Profile account={account} />
        </>
    );
}


export default Account;