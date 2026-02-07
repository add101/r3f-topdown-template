import React from 'react';

export const Lights = () => {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light (sun) */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      
      {/* Hemisphere light for sky/ground ambient */}
      <hemisphereLight
        skyColor="#87CEEB"
        groundColor="#90ee90"
        intensity={0.3}
      />
    </>
  );
};
