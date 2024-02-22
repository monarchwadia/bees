import type { Bee, WorldState } from "./types";

let nextId = 1;

const ai = (b: Bee, state: WorldState) => {
  b.x += Math.random() * 10 - 5;
  b.y += Math.random() * 10 - 5;
};

export const beeBuilder = (b: Partial<Bee>): Bee => {
  return {
    id: nextId++,
    x: 0,
    y: 0,
    color: [255, 255, 0],
    ai,
    ...b,
  };
};
