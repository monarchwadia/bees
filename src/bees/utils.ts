import type { WorldState } from "./types";

export const getCenterpoint = (state: WorldState) => {
  return {
    x: state.config.mapWidth / 2,
    y: state.config.mapHeight / 2,
  };
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
