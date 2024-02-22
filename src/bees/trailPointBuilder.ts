import { getNextObjectId } from "./getNextObjectId";
import type { Bee, TrailPoint, WorldState } from "./types";
import { getCenterpoint } from "./utils";

export const trailPointBuilder = (
  tp: Partial<TrailPoint>,
  state: WorldState
): TrailPoint => {
  return {
    id: getNextObjectId(),
    type: "trail-point",
    ...getCenterpoint(state),
    ...tp,
  };
};
