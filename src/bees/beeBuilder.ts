import type { Bee, WorldState } from "./types";

let nextId = 1;

const ai = (b: Bee, state: WorldState) => {
  b.x += Math.random() * 10 - 5;
  b.y += Math.random() * 10 - 5;
};

export const beeBuilder = (b: Partial<Bee>, state: WorldState): Bee => {
  const centerpoint = {
    x: state.config.width / 2,
    y: state.config.height / 2,
  };

  return {
    id: nextId++,
    ...centerpoint,
    color: [255, 255, 0],
    ai,
    ...b,
  };
};
