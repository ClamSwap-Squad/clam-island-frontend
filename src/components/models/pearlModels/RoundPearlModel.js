import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { usePearlNoiseGeometry } from "hooks/usePearlNoiseGeometry";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/pearl-models/Pearl_round.glb");
  const {
    map,
    envMap,
    emissiveMap,
    envMapIntensity,
    color,
    emissive,
    emissiveIntensity,
    roughness,
    glowMaterial,
    backGlowMaterial,
    surface,
  } = props;

  const noiseGeometry = usePearlNoiseGeometry(nodes.Round, surface);

  if (!noiseGeometry) {
    return null;
  }

  return (
    <group ref={group} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <group ref={group} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow receiveShadow geometry={noiseGeometry}>
          <meshStandardMaterial
            {...materials.Pearls1}
            map={map}
            envMap={envMap}
            emissiveMap={emissiveMap}
            envMapIntensity={envMapIntensity}
            emissiveIntensity={emissiveIntensity}
            emissive={emissive}
            color={color}
            roughness={roughness}
          />
        </mesh>
        {glowMaterial && (
          <mesh
            geometry={nodes.Round.geometry}
            material={glowMaterial}
            scale={1.025}
            layers={1}
            position={[0, -0.001, 0]}
          />
        )}
        {backGlowMaterial && (
          <mesh
            geometry={nodes.Round.geometry}
            material={backGlowMaterial}
            scale={1.1}
            position={[0, -0.002, 0]}
            layers={1}
          />
        )}
      </group>
    </group>
  );
}
