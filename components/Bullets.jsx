import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/useGameStore';

const Bullet = ({ id, position, direction }) => {
  const bulletRef = useRef();
  const lifetimeRef = useRef(0);
  const { removeBullet } = useGameStore();
  const MAX_LIFETIME = 3; // seconds
  const BULLET_SPEED = 20;

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.setLinvel({
        x: direction[0] * BULLET_SPEED,
        y: direction[1] * BULLET_SPEED,
        z: direction[2] * BULLET_SPEED,
      }, true);
    }
  }, [direction]);

  useFrame((state, delta) => {
    lifetimeRef.current += delta;
    if (lifetimeRef.current > MAX_LIFETIME) {
      removeBullet(id);
    }
  });

  return (
    <RigidBody
      ref={bulletRef}
      colliders="ball"
      position={position}
      gravityScale={0}
      mass={0.1}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffaa00"
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Glow effect */}
      <pointLight color="#ffff00" intensity={2} distance={2} />
    </RigidBody>
  );
};

export const Bullets = () => {
  const bullets = useGameStore((state) => state.bullets);

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          position={bullet.position}
          direction={bullet.direction}
        />
      ))}
    </>
  );
};
