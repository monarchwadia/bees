import { getNextObjectId } from "./getNextObjectId";
import type { Bee, TrailPoint, WorldState } from "./types";
import { getCenterpoint } from "./utils";

const DECAY_RATE = 0.2;

export const trailPointBuilder = (
  tp: Partial<TrailPoint>,
  state: WorldState
): TrailPoint => {
  return {
    id: getNextObjectId(),
    type: "trail-point",
    strength: 90,
    ai: (b: TrailPoint, state: WorldState) => {
      // decay the trail point's pollen
      if (Math.random() < DECAY_RATE) {
        b.strength -= 1;
      }

      if (b.strength <= 0) {
        // remove itself
        state.objects = state.objects.filter((o) => o.id !== b.id);
      }
    },
    ...getCenterpoint(state),
    ...tp,
  };
};
