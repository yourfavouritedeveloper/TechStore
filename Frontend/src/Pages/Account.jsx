import Nav from "../Components/Nav/Nav";
import Profile from "../Components/Account/Account";
import { useNavigate, useParams, useLocation,Navigate  } from "react-router-dom";
import {useEffect,useState,useContext } from "react";
import axios from "axios";
import { usePurchase } from "../Components/Utils/PurchaseContext";
import { AuthContext  } from "../Components/AuthContext";

function Account() {

      const { isPurchase, setIsPurchase } = usePurchase();

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    window.onbeforeunload = () => window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;

  const location = useLocation();
  const { username } = useParams();
  const { account: checkAccount, loading, token,refreshAccessToken, logout } = useContext(AuthContext);

  const [edit, setEdit] = useState(location.state?.edit || false);
  const [account, setAccount] = useState([]);
  const [ready, setReady] = useState(false);

  
    useEffect(() => {
      if (!loading) {
        if (!checkAccount || checkAccount.username !== username) {
          navigate("/login", { state: { from: location } });
        } else {
          setReady(true);
        }
      }
    }, [loading, checkAccount, username, navigate]);


      useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        window.onbeforeunload = () => window.scrollTo(0, 0);
      }, []);

    useEffect(() => { 
        if (!refreshToken) { 
            navigate("/login", { state: { from: location } }); 
        } 
        else if (!token) {
             refreshAccessToken(); 
        } 
    }, [token,refreshToken, navigate, location,refreshAccessToken]);



    useEffect(() => {
      if (location.state?.edit) setEdit(true);
    }, [location.state]);

 useEffect(() => {
    if (!ready || !token) return;

    const fetchAccount = async () => {
      try {
        const response = await axios.get(
          `https://techstore-3fvk.onrender.com/api/v1/accounts/username/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAccount(response.data);
      } catch (err) {
        console.error("Error fetching account:", err);
      }
    };

    fetchAccount();
  }, [username, ready, token]);

    
  const handleEditClick = () => {
      setEdit(true);
      navigate(`/account/${username}`);
    };

      useEffect(() => {
    if (account?.customerName) {
      document.title = `Account | ${account.customerName}`;
    } else {
      document.title = "Account";
    }
  }, [account]);

  if (!ready || !account) return null;

    return (
        <>
        <title>{"Account | " + account.customerName}</title>
        <Nav highlight={true}  onEditClick={handleEditClick} ></Nav>
        <Profile account={account}  edit={edit} setEdit={setEdit} token={token} isPurchase={isPurchase} logout={logout}/>
        </>
    );
}


export default Account;