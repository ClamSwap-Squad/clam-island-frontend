import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  useFrame,
  extend,
  useThree
} from "@react-three/fiber";
import { useRef } from 'react';

extend({ OrbitControls });

export const CameraControls = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controls = useRef();
  useFrame(() => controls.current.update());

  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      minPolarAngle={Math.PI/2 - 0.13}
      maxPolarAngle={Math.PI/2 - 0.13}
      target={[0, 0.12, 0]}
      rotateSpeed={0.2}
    />
  );
};
