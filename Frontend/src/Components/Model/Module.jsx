import { OrbitControls ,PerspectiveCamera} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Model";

function Module() {

    return(
        <>
        <Canvas
        style={{
            height: "130vh",
            width: "100vw",
            position: "absolute",
            marginTop: "-103rem",
            zIndex: "2",
        }}>
        <PerspectiveCamera makeDefault position={[-10, 9,10]} fov={0.8} />
        <OrbitControls 
        enableZoom={false} 
        enablePan={false}/>
        <ambientLight intensity={10} />
        <directionalLight position={[-600, 100, -500]} intensity={6000} />
        <pointLight position={[0, 5, 10]} intensity={0.8} />
        <Model />
        </Canvas>
        </>
    );
}

export default Module;