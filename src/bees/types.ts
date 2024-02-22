export type Bee = {
  id: number;
  x: number;
  y: number;
  color: [number, number, number, number?];
};

export type WorldState = {
  config: {
    width: number;
    height: number;
  };
  bees: Bee[];
};
