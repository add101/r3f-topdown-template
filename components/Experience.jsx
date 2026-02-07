import React from 'react';
import { Environment } from './Environment';
import { Character } from './Character';
import { CameraController } from './CameraController';
import { Lights } from './Lights';

export const Experience = () => {
  return (
    <>
      <Lights />
      <Environment />
      <Character />
      <CameraController />
    </>
  );
};
