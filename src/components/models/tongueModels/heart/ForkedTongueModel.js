import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes } = useGLTF('/clam-models/heart/Tongues/forked.glb')
  const materialProps = useTexture({ normalMap: '/clam-models/tongue-normal.png' })
  const { tongueTexture, ...rest } = props

  return (
    <group ref={group} {...rest} dispose={null}>
      <group scale={0.308522}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cc_forked1.geometry}
          position={[-0.009945, -0.086468, -0.257009]}
          rotation={[0.549713, 0, 0]}
          scale={23.660522}
        >
          <meshStandardMaterial attach="material" {...materialProps}>
            <canvasTexture attach="map" args={[tongueTexture]} />
          </meshStandardMaterial>
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/clam-models/heart/Tongues/forked.glb')
