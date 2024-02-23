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
    ai: (b: Flower, state: WorldState) => {
      // if flower is depleted, remove it
      if (b.pollen <= 0) {
        state.objects = state.objects.filter((o) => o.id !== b.id);
      }
    },
    ...getCenterpoint(state),
    ...tp,
  };
};
