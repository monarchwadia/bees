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
  pollen: number;
  hunger: number; // if it reaches 100, it dies
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
    bee: {
      flightRandomness: number;
      objectDetectionRange: number;
      objectInteractionRange: number;
      trailPointAttraction: number;
      rotationSpeedMin: number;
      rotationSpeedMax: number;
      trailPointDropChance: number;
      hungerFeedingThreshold: number;
      trailpointCreationMinStrength: number;
      trailpointCreationMaxStrength: number;
    };
    hive: {
      pollenStockpileMinimum: number;
    };
    flower: {
      creationChance: number;
    };
  };
  controls: {
    isRunning: boolean;
    speed: number;
    brush: "bee" | "flower" | "trail-point" | "erase";
  };
  hive: {
    pollen: number;
  };
  objects: WorldObject[];
};
