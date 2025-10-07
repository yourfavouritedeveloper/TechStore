import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

function WaterBubble({ radius = 1.5 }) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(radius, 50);
    geom.attributes.position.originalPosition = geom.attributes.position.array.slice();

    const colors = [];
    for (let i = 0; i < geom.attributes.position.count; i++) {
      colors.push(1, 1, 1); 
    }
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    return geom;
  }, [radius]);

  const noise = useMemo(() => new SimplexNoise(), []);

  useFrame(({ clock }) => {
    const positions = geometry.attributes.position.array;
    const colors = geometry.attributes.color.array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < positions.length; i += 3) {
      const ox = geometry.attributes.position.originalPosition[i];
      const oy = geometry.attributes.position.originalPosition[i + 1];
      const oz = geometry.attributes.position.originalPosition[i + 2];

      const offset = noise.noise3d(ox * 0.5, oy * 0.5, time * 0.5) * 0.2;
      positions[i] = ox + offset;
      positions[i + 1] = oy + offset;
      positions[i + 2] = oz + offset;

      const gray = 1 + 0.3 * noise.noise3d(ox, oy, time);
      colors[i] = gray;
      colors[i + 1] = gray;
      colors[i + 2] = gray;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.9}
        roughness={0.1}
        metalness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{width: "70rem", height: "70rem" }}>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <WaterBubble />
    </Canvas>
  );
}
