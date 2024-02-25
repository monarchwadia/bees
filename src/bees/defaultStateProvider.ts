import type { WorldState } from "@bees/types";
import { GLOBAL_DEFAULT_SPEED } from "./constants";

export const defaultStateProvider = () => {
  const config = {
    bee: {
      flightRandomness: 7,
      objectDetectionRange: 50,
      objectInteractionRange: 10,
      trailPointAttraction: 2,
      rotationSpeedMin: 0.004,
      rotationSpeedMax: 0.008,
      trailPointDropChance: 0.2,
      hungerFeedingThreshold: 80,
      trailpointCreationMinStrength: 250,
      trailpointCreationMaxStrength: 750,
    },
    hive: {
      pollenStockpileMinimum: 25,
    },
    flower: {
      creationChance: 0.001,
    },
  };

  const state: WorldState = {
    config,
    hive: {
      pollen: 65,
    },
    controls: {
      isRunning: true,
      speed: GLOBAL_DEFAULT_SPEED,
    },
    objects: [],
  };

  // trails for bees
  state.objects.push();

  return state;
};
