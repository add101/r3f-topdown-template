import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Experience } from './components/Experience';

export const Controls = {
  forward: 'forward',
  backward: 'backward',
  left: 'left',
  right: 'right',
  shoot: 'shoot',
};

function Game() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <KeyboardControls
        map={[
          { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
          { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
          { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
          { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
          { name: Controls.shoot, keys: ['Space'] },
        ]}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 0], fov: 30 }}
          style={{ background: '#87CEEB' }}
        >
          <Suspense fallback={null}>
            <Physics>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>Controls:</div>
        <div>WASD / Arrow Keys - Move</div>
        <div>Space - Shoot</div>
      </div>
    </div>
  );
}

export default Game;
