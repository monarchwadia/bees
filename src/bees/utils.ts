import { GLOBAL_MAP_HEIGHT, GLOBAL_MAP_WIDTH } from "./constants";
import type { WorldState } from "./types";

export const getCenterpoint = (state: WorldState) => {
  return {
    x: GLOBAL_MAP_WIDTH / 2,
    y: GLOBAL_MAP_HEIGHT / 2,
  };
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
