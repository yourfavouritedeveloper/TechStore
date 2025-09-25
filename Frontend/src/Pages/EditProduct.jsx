import { useState,useContext,useEffect } from "react";
import EditItem from "../Components/EditItem/EditItem";
import Nav from "../Components/Nav/Nav";
import { useParams,useNavigate } from "react-router-dom"; 
import { AuthContext  } from "../Components/AuthContext";


function EditProduct() {

    const [highlight, setHighlight] = useState(false)
    const { username } = useParams();
    const { account: checkAccount, loading } = useContext(AuthContext);
    const [ready, setReady] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
      if (!loading) {
        if (!checkAccount || checkAccount.username !== username) {
          navigate("/login", { replace: true });
        } else {
          setReady(true); 
        }
      }
    }, [loading, checkAccount, username, navigate]);

    

    return(<>
    <title>Add a new Product</title>
        <Nav highlight={true} setHighlight={setHighlight}/>
        <EditItem highlight={highlight} setHighlight={setHighlight}  username={username}/>
    
    </>);
}


export default EditProduct;