import Nav from "../Components/Nav/Nav";
import SuccessPage from "../Components/Success/Success"


function Success() {
    return(<>
    <title>Successful Payment</title>
        <Nav highlight={true}/>
        <SuccessPage />
    </>);
}

export default Success;