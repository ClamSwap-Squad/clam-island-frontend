import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

import { usePearlNoiseGeometry } from "../../../hooks/usePearlNoiseGeometry";

/** Params for noise */
const seed = 0;
const noiseWidth = 0.015;
const noiseHeight = 0.03;

const getNoise = (vertice) =>
  ImprovedNoise().noise(
    seed + vertice.x / noiseWidth,
    seed + vertice.y / noiseWidth,
    seed + vertice.z / noiseWidth
  );

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/pearl-models/Pearl_oval.glb");
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

  const noiseGeometry = usePearlNoiseGeometry(nodes.Oval, surface);

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
          geometry={nodes.Oval.geometry}
          material={glowMaterial}
          scale={1.025}
          layers={1}
          position={[0, -0.001, 0]}
        />
      )}
      {backGlowMaterial && (
        <mesh
          geometry={nodes.Oval.geometry}
          material={backGlowMaterial}
          scale={1.1}
          position={[0, -0.002, 0]}
          layers={1}
        />
      )}
    </group>
  );
}
