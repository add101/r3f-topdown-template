import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const CameraController = () => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());

  useFrame((state) => {
    const characterPosition = new THREE.Vector3(0, 2, 0);
    
    const scene = state.scene;
    scene.traverse((child) => {
      if (child.userData?.isCharacter) {
        characterPosition.copy(child.position);
      }
    });

    // Isometric offset
    const offset = new THREE.Vector3(0, 10, 8);
    
    targetPosition.current.copy(characterPosition).add(offset);
    camera.position.lerp(targetPosition.current, 0.1);
    
    // Look at character - Z axis will be aligned
    const lookAtTarget = characterPosition.clone();
    lookAtTarget.y += 1;
    camera.lookAt(lookAtTarget);
  });

  return null;
};
