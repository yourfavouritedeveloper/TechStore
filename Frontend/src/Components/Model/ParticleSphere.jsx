import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

function SlimeNeuronCloud({ count = 4000, radius = 1.5, color = "lightblue" }) {
  const pointsRef = useRef();
  const groupRef = useRef();
  const { mouse, viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [prevMouse, setPrevMouse] = useState([0, 0]);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * Math.sqrt(Math.random());
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const z = 0;

      const original = new THREE.Vector3(x, y, z);
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        0
      );

      const wigglePhase = Math.random() * Math.PI * 2;
      temp.push({ position: new THREE.Vector3(x, y, z), original, velocity, wigglePhase });
    }
    return temp;
  }, [count, radius]);

  useFrame(() => {
    if (!pointsRef.current || !groupRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array;

    if (!dragging) groupRef.current.rotation.z += 0.003;

    if (dragging) {
      const deltaX = mouse.x - prevMouse[0];
      const deltaY = mouse.y - prevMouse[1];
      groupRef.current.rotation.z += (deltaX + deltaY) * Math.PI;
      setPrevMouse([mouse.x, mouse.y]);
    }

    const mouse2D = new THREE.Vector3(
      mouse.x * viewport.width / 2,
      mouse.y * viewport.height / 2,
      0
    );

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.wigglePhase += 0.02 + Math.random() * 0.01;
      const wiggleRadius = 0.25 * Math.sin(p.wigglePhase);
      const angle = Math.atan2(p.original.y, p.original.x);
      const targetX = (p.original.length() + wiggleRadius) * Math.cos(angle);
      const targetY = (p.original.length() + wiggleRadius) * Math.sin(angle);

      if (!hovered) {
        const restore = new THREE.Vector3(targetX, targetY, 1.18).sub(p.position).multiplyScalar(0.02);
        p.velocity.add(restore);
      }

      if (hovered) {
        const dir = new THREE.Vector3().subVectors(p.position, mouse2D);
        const dist = dir.length();
        if (dist < 1.5) {
          dir.normalize().multiplyScalar(0.03 / (dist + 0.1));
          p.velocity.add(dir);
        }
      }

      p.velocity.x += (Math.random() - 0.5) * 0.0055;
      p.velocity.y += (Math.random() - 0.5) * 0.0015;

      p.velocity.multiplyScalar(0.9);

      p.position.add(p.velocity);

      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = 0;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points
        ref={pointsRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          if (e.button === 0) {
            setDragging(true);
            setPrevMouse([mouse.x, mouse.y]);
          }
        }}
        onPointerUp={(e) => {
          if (e.button === 0) setDragging(false);
        }}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(particles.flatMap(p => [p.position.x, p.position.y, 0]))}
            count={particles.length}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.015}
          sizeAttenuation
          transparent
          opacity={1}
        />
      </points>
    </group>
  );
}

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <SlimeNeuronCloud />
    </Canvas>
  );
}
