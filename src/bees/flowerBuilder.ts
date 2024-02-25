import {
  FLOWER_STARTING_POLLEN,
  GLOBAL_MAP_HEIGHT,
  GLOBAL_MAP_WIDTH,
} from "./constants";
import { getNextObjectId } from "./getNextObjectId";
import type { Bee, Flower, TrailPoint, WorldState } from "./types";
import { getCenterpoint } from "./utils";

export const flowerBuilder = (
  tp: Partial<Flower>,
  state: WorldState
): Flower => {
  const coords = {
    x: Math.round(Math.random() * GLOBAL_MAP_WIDTH),
    y: Math.round(Math.random() * GLOBAL_MAP_HEIGHT),
  };

  return {
    id: getNextObjectId(),
    type: "flower",
    pollen: FLOWER_STARTING_POLLEN,
    ai: (b: Flower, state: WorldState) => {
      // if flower is depleted, remove it
      if (b.pollen <= 0) {
        state.objects = state.objects.filter((o) => o.id !== b.id);
      }
    },
    ...coords,
    ...tp,
  };
};
