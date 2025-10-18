import Nav from "../Components/Nav/Nav";
import SuccessPage from "../Components/Success/Success"


function Success() {
    return(<>
    <title>Successfull Payment</title>
        <Nav highlight={true}/>
        <SuccessPage />
    </>);
}

export default Success;