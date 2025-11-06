import { useLocation } from "react-router-dom";
import Recovery from "../Components/Recovery/Recovery";

function Password() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  return (<>
    <title>Recover Your Account</title>
    <Recovery token={token} />
  </>);
}

export default Password;