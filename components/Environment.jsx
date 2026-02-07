import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { Bullets } from './Bullets';

export const Environment = () => {
  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" friction={1}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#90ee90" />
        </mesh>
      </RigidBody>

      {/* Grid helper for reference */}
      <gridHelper args={[50, 50, '#888', '#ccc']} position={[0, 0.01, 0]} />

      {/* Bullets */}
      <Bullets />
    </>
  );
};
