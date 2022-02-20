import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

import { usePearlNoiseGeometry } from "hooks/usePearlNoiseGeometry";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/pearl-models//Pearl_baroque.glb");
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

  const noiseGeometry = usePearlNoiseGeometry(nodes.Pearl_Baroque, surface);

  if (!noiseGeometry) {
    return null;
  }

  return (
    <group ref={group} {...props}>
      <mesh geometry={noiseGeometry} material={materials.Pearl}>
        <meshStandardMaterial
          {...materials.Pearl}
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
          geometry={nodes.Pearl_Baroque.geometry}
          material={glowMaterial}
          scale={1.025}
          position={[0, -0.001, 0]}
          layers={1}
        />
      )}
      {backGlowMaterial && (
        <mesh
          geometry={nodes.Pearl_Baroque.geometry}
          material={backGlowMaterial}
          scale={1.1}
          position={[0, -0.0035, 0]}
          layers={1}
        />
      )}
    </group>
  );
}
