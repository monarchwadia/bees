type AiFunction<T extends BaseObject> = (obj: T, state: WorldState) => void;

type BaseObject = {
  type: string;
  id: number;
  x: number;
  y: number;
  ai: AiFunction<any>;
};

export type Bee = {
  type: "bee";
  state: "wandering" | "gathering-pollen";
  direction: -1 | 1; // -1 is counterclockwise, 1 is clockwise
  ai: AiFunction<Bee>;
} & BaseObject;

export type TrailPoint = {
  type: "trail-point";
  strength: number;
  ai: AiFunction<TrailPoint>;
} & BaseObject;

export type Flower = {
  type: "flower";
  pollen: number;
  ai: AiFunction<Flower>;
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
