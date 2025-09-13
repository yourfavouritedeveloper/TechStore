import Nav from "../Components/Nav/Nav";
import Profile from "../Components/Account/Account";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {useEffect,useState} from "react";
import axios from "axios";
import { usePurchase } from "../Components/Utils/PurchaseContext";

function Account() {

      const { isPurchase, setIsPurchase } = usePurchase();

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    window.onbeforeunload = () => window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;

    const { username } = useParams();
    const location = useLocation();
    const [edit, setEdit] = useState(location.state?.edit || false);
    const [account, setAccount] = useState([]);

    useEffect(() => {
      if (location.state?.edit) {
        setEdit(true);
      }
    }, [location.state]);

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

  
  const handleEditClick = () => {
    setEdit(true);  
    navigate(`/account/${username}`); 
  };

    return (
        <>
        <title>{"Account | " + account.customerName}</title>
        <Nav highlight={true}  onEditClick={handleEditClick} ></Nav>
        <Profile account={account}  edit={edit} setEdit={setEdit}  isPurchase={isPurchase}/>
        </>
    );
}


export default Account;