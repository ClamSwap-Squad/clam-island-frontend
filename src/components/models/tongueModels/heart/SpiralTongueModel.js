import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes } = useGLTF('/clam-models/heart/Tongues/spiral.glb')
  const materialProps = useTexture({ normalMap: '/clam-models/tongue-normal.png' })
  const { tongueTexture, ...rest } = props

  return (
    <group ref={group} {...rest} dispose={null}>
      <group scale={0.308522}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.t_spiral1.geometry}
          position={[-0.028314, -0.107362, -0.415121]}
          scale={2.154907}
        >
          <meshStandardMaterial attach="material" {...materialProps}>
            <canvasTexture attach="map" args={[tongueTexture]} />
          </meshStandardMaterial>
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/clam-models/heart/Tongues/spiral.glb')
