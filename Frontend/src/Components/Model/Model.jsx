
import React, { useRef,useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from "@react-three/fiber";
import { a, useSpring } from '@react-spring/three';




export function Model(props) {
  const { nodes, materials } = useGLTF('/TechStore/hp_victus_gaming_laptop/scene.gltf')
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.0008; 
      ref.current.rotation.y += 0.0003; 
      ref.current.rotation.x += 0.0004; 
    }
  });

    const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModel(true), 300); // 2 sec delay
    return () => clearTimeout(timer);
  }, []);

    const { scale,opacity } = useSpring({
    scale: showModel ? 1 : 0.9,
    opacity: showModel ? 1 : 0.7,
    config: { mass: 1, tension: 280, friction: 60 },
  });




    if (!showModel) return null; 


  return (
    <a.group ref={ref} {...props} dispose={null} scale={scale}>
      <a.mesh
        castShadow
        receiveShadow
        geometry={nodes.victus_aiStandardSurface1_0.geometry}
        material={materials.aiStandardSurface1}
        scale={0.01}
      />
    </a.group>
  )
}

useGLTF.preload('/hp_victus_gaming_laptop/scene.gltf')