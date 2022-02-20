import { useEffect, useState } from "react";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";
import * as THREE from "three";

/** Params for noise */
const seed = 0;
const noiseWidth = 0.015;
const maxNoiseHeight = 0.04;

const getNoise = (vertice) =>
  ImprovedNoise().noise(
    seed + vertice.x / noiseWidth,
    seed + vertice.y / noiseWidth,
    seed + vertice.z / noiseWidth
  );

export const usePearlNoiseGeometry = (pearl, surface) => {
  const [noiseGeometry, setNoiseGeometry] = useState(null);

  useEffect(() => {
    const clonedGeometry = pearl.geometry.clone();
    const position = clonedGeometry.getAttribute("position");
    const noiseHeight = (1 - surface / 100) * maxNoiseHeight;

    const vector = new THREE.Vector3();
    const vertices = [];
    for (let i = 0, l = position.count; i < l; i++) {
      vector.fromBufferAttribute(position, i);
      vector.applyMatrix4(pearl.matrixWorld);
      vertices.push(vector.clone());
    }

    const noiseMap = vertices.map(getNoise),
      noiseMax = Math.max(...noiseMap),
      noiseMin = -Math.min(...noiseMap);

    for (let v = 0; v < vertices.length; v++) {
      if (noiseMap[v] > 0) {
        vertices[v].elevation = noiseMap[v] / noiseMax;
      } else {
        vertices[v].elevation = noiseMap[v] / noiseMin;
      }
      vertices[v].multiplyScalar(1 + vertices[v].elevation * noiseHeight);
    }

    const newPositions = [];
    for (const vert of vertices) {
      newPositions.push(vert.x, vert.y, vert.z);
    }
    clonedGeometry.attributes.position.array = clonedGeometry.attributes.position.array.map(
      (_, i) => newPositions[i]
    );

    setNoiseGeometry(clonedGeometry);
  }, []);

  return noiseGeometry;
};
