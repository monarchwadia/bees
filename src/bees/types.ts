export type Bee = {
  id: number;
  x: number;
  y: number;
  color: [number, number, number, number?];
  ai: (bee: Bee, state: WorldState) => void;
};

export type WorldState = {
  config: {
    width: number;
    height: number;
  };
  bees: Bee[];
};
