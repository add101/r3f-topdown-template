import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useGLTF, useAnimations } from '@react-three/drei';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { Controls } from '../Game';
import { useGameStore } from '../store/useGameStore';


export const Character = () => {
  const characterRef = useRef();
  const characterMeshRef = useRef();
  const { spawnBullet } = useGameStore();
  const { scene } = useGLTF('/models/Ch46_nonPBR.glb');
  const { animations: walkAnimations } = useGLTF('/models/walking.glb');
  const { animations: idleAnimations } = useGLTF('/models/idle.glb');
  const { animations: shootAnimations } = useGLTF('/models/pistol_idle.glb');

  const animations = useMemo(() => {
    if (walkAnimations.length) walkAnimations[0].name = 'Walk';
    if (idleAnimations.length) idleAnimations[0].name = 'Idle';
    if (shootAnimations.length) shootAnimations[0].name = 'PistolIdle';
    return [...idleAnimations, ...walkAnimations, ...shootAnimations];
  }, [idleAnimations, walkAnimations, shootAnimations]);

  const { actions } = useAnimations(animations, characterMeshRef);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  
  const shootCooldownRef = useRef(0);
  const SHOOT_COOLDOWN = 0.3; // seconds

  // Get the keyboard controls subscribe function
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const currentAction = useRef('Idle');

  useEffect(() => {
    actions['Idle']?.reset().fadeIn(0.5).play();
    
    const unsubscribe = subscribeKeys(
      (state) => ({
        moving: state.forward || state.backward || state.left || state.right,
        shooting: state.shoot
      }),
      ({ moving, shooting }) => {
        // Determine target animation: Walk overrides Shoot, Shoot overrides Idle
        const targetAnim = moving ? 'Walk' : (shooting ? 'PistolIdle' : 'Idle');

        if (targetAnim !== currentAction.current) {
          const prevAnim = currentAction.current;
          
          actions[prevAnim]?.fadeOut(0.2);
          actions[targetAnim]?.reset().fadeIn(0.2).play();
          
          currentAction.current = targetAnim;
        }
      }
    );
    return unsubscribe;
  }, [actions, subscribeKeys]);

  useFrame((state, delta) => {
    if (!characterRef.current) return;

    const { forward, backward, left, right, shoot } = getKeys();

    // Movement
    const impulse = { x: 0, y: 0, z: 0 };
    const impulseStrength = 0.3;

    if (forward) impulse.z -= impulseStrength;
    if (backward) impulse.z += impulseStrength;
    if (left) impulse.x -= impulseStrength;
    if (right) impulse.x += impulseStrength;

    characterRef.current.applyImpulse(impulse, true);

    // Rotation based on movement
    if (impulse.x !== 0 || impulse.z !== 0) {
      const angle = Math.atan2(impulse.x, impulse.z);
      characterMeshRef.current.rotation.y = angle;
    }

    // Shooting
    shootCooldownRef.current -= delta;
    if (shoot && shootCooldownRef.current <= 0) {
      shootCooldownRef.current = SHOOT_COOLDOWN;
      
      const position = characterRef.current.translation();
      const rotation = characterMeshRef.current.rotation.y;
      
      const direction = new THREE.Vector3(
        Math.sin(rotation),
        0,
        Math.cos(rotation)
      );

      // Offset spawn point so bullet doesn't collide with character capsule (radius 0.5)
      const spawnOffset = direction.clone().multiplyScalar(1);
      const spawnPos = new THREE.Vector3(position.x, position.y, position.z).add(spawnOffset);

      spawnBullet({
        position: [spawnPos.x, spawnPos.y, spawnPos.z],
        direction: direction.toArray(),
      });
    }

    // Limit velocity
    const velocity = characterRef.current.linvel();
    const maxSpeed = 1.25;
    if (Math.abs(velocity.x) > maxSpeed || Math.abs(velocity.z) > maxSpeed) {
      const factor = maxSpeed / Math.max(Math.abs(velocity.x), Math.abs(velocity.z));
      characterRef.current.setLinvel({
        x: velocity.x * factor,
        y: velocity.y,
        z: velocity.z * factor,
      }, true);
    }
  });

  return (
    <RigidBody
      ref={characterRef}
      colliders={false}
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={2}
      angularDamping={1}
    >
      <CapsuleCollider args={[0.5, 0.5]}  visible={false} />
      
      <group ref={characterMeshRef}>
        <primitive object={scene} position={[0, -1, 0]} />
      </group>
    </RigidBody>
  );
};
