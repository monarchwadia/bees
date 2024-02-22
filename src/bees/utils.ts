import type { WorldState } from "./types";

export const getCenterpoint = (state: WorldState) => {
  return {
    x: state.config.width / 2,
    y: state.config.height / 2,
  };
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
