import { useEffect } from "react";
import Nav from "../Components/Nav/Nav";
import Log from "../Components/Login/Login";
import Footer from "../Components/Footer/Footer";
function Login({ shiftUp, setShiftUp }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

    return  (<>
        <title>Log in / Sign up</title>
        <Log shiftUp={shiftUp} setShiftUp={setShiftUp} />
    </>);
}

export default Login;