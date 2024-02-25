import type { WorldState } from "@bees/types";
import { beeBuilder } from "@bees/beeBuilder";
import { flowerBuilder } from "@bees/flowerBuilder";
import {
  GLOBAL_DEFAULT_SPEED,
  GLOBAL_MAP_HEIGHT,
  GLOBAL_MAP_WIDTH,
} from "./constants";

export const defaultStateProvider = () => {
  const config = {
    mapWidth: GLOBAL_MAP_WIDTH,
    mapHeight: GLOBAL_MAP_HEIGHT,
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
