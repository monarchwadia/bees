import { getNextObjectId } from "./getNextObjectId";
import type { Bee, Flower, TrailPoint, WorldState } from "./types";
import { getCenterpoint } from "./utils";

export const flowerBuilder = (
  tp: Partial<Flower>,
  state: WorldState
): Flower => {
  return {
    id: getNextObjectId(),
    type: "flower",
    pollen: 5,
    ...getCenterpoint(state),
    ...tp,
  };
};
