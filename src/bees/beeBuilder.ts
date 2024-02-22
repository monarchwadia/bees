import type { Bee } from "./types";

let nextId = 1;

const ai = (b: Bee) => {
  b.x += Math.random() * 10 - 5;
  b.y += Math.random() * 10 - 5;
};

console.log("beeBuilder.ts", ai);

export const beeBuilder = (b: Partial<Bee>): Bee => {
  console.log("beeBuilder.ts", ai);

  return {
    id: nextId++,
    x: 0,
    y: 0,
    color: [255, 255, 0],
    ai,
    ...b,
  };
};
