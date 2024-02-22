type BaseObject = {
  type: string;
  id: number;
  x: number;
  y: number;
};

export type Bee = {
  type: "bee";
  state: "wandering" | "gathering-pollen";
  ai: (bee: Bee, state: WorldState) => void;
} & BaseObject;

export type TrailPoint = {
  type: "trail-point";
} & BaseObject;

export type Flower = {
  type: "flower";
  pollen: number;
} & BaseObject;

type WorldObject = Bee | Flower | TrailPoint;

export type WorldState = {
  config: {
    width: number;
    height: number;
  };
  controls: {
    isRunning: boolean;
    speed: number;
  };
  objects: WorldObject[];
};
