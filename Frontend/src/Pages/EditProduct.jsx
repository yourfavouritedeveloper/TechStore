import { useState,useContext,useEffect } from "react";
import EditItem from "../Components/EditItem/EditItem";
import Nav from "../Components/Nav/Nav";
import { useParams,useNavigate } from "react-router-dom"; 
import { AuthContext  } from "../Components/AuthContext";
import axios from "axios";


function EditProduct() {

    const [highlight, setHighlight] = useState(false)
    const { username, id } = useParams();
    const [product, setProduct] = useState(null);
    const { account: checkAccount, loading } = useContext(AuthContext);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://techstore-3fvk.onrender.com/api/v1/products/id/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Failed to fetch product.");
        console.error(err);
      } 
    };

    fetchProduct();
  }, [id]);

    useEffect(() => {
      if (!loading) {
        if (!checkAccount || checkAccount.username !== username) {
          navigate("/login", { replace: true });
        } else {
          setReady(true); 
        }
      }
    }, [loading, checkAccount, username, navigate]);


    useEffect(() => {
    if (product) {
        document.title = `Edit | ${product.name}`;
    } else {
        document.title = "Loading...";
    }
    }, [product]);


    

    return(<>
        <Nav highlight={true} setHighlight={setHighlight}/>
        <EditItem highlight={highlight} setHighlight={setHighlight}  username={username} product={product}/>
    
    </>);
}


export default EditProduct;