import { create } from 'zustand';

let bulletIdCounter = 0;

export const useGameStore = create((set) => ({
  bullets: [],
  
  spawnBullet: ({ position, direction }) => {
    const bullet = {
      id: bulletIdCounter++,
      position,
      direction,
      createdAt: Date.now(),
    };
    
    set((state) => ({
      bullets: [...state.bullets, bullet],
    }));
  },
  
  removeBullet: (id) => {
    set((state) => ({
      bullets: state.bullets.filter((bullet) => bullet.id !== id),
    }));
  },
  
  clearBullets: () => {
    set({ bullets: [] });
  },
}));
