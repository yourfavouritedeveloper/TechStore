
import Nav from "../Components/Nav/Nav";
import Log from "../Components/Login/Login";
import Footer from "../Components/Footer/Footer";
function Login({ shiftUp, setShiftUp }) {


    return  (<>
        <div
      style={{
        overflowY: "hidden",
        height: "89.2vh",
        width: "100%",
        position: "relative"
      }}
    >
        <Log shiftUp={shiftUp} setShiftUp={setShiftUp} />
    </div>
    <Footer />
    </>);
}

export default Login;