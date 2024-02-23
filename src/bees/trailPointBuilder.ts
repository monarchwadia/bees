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
    strength: 500,
    ai: (b: TrailPoint, state: WorldState) => {
      // decay the trail point's pollen
      if (Math.random() < DECAY_RATE) {
        b.strength -= 1;
      }

      // wear and tear: decay it even more if it's close to bees
      const numBeesNear = state.objects.filter((o) => {
        if (o.type === "bee") {
          const distance = Math.sqrt(
            Math.pow(o.x - b.x, 2) + Math.pow(o.y - b.y, 2)
          );
          if (distance < 40) {
            return true;
          }
        }
      });

      b.strength -= numBeesNear.length * 2;

      if (b.strength <= 0) {
        // remove itself
        state.objects = state.objects.filter((o) => o.id !== b.id);
      }
    },
    ...getCenterpoint(state),
    ...tp,
  };
};
