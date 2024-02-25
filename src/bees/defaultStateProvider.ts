import type { WorldState } from "@bees/types";
import { beeBuilder } from "@bees/beeBuilder";
import { flowerBuilder } from "@bees/flowerBuilder";
import { GLOBAL_MAP_HEIGHT, GLOBAL_MAP_WIDTH } from "./constants";

export const defaultStateProvider = () => {
  const config = {
    mapWidth: GLOBAL_MAP_WIDTH,
    mapHeight: GLOBAL_MAP_HEIGHT,
  };

  const state: WorldState = {
    config,
    hive: {
      pollen: 0,
    },
    controls: {
      isRunning: true,
      speed: 1,
    },
    objects: [],
  };

  // initial bees
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));

  // initial flowers
  state.objects.push(flowerBuilder({ x: 100, y: 100 }, state));
  state.objects.push(beeBuilder({ x: 100, y: 100 }, state));

  // trails for bees
  state.objects.push();

  return state;
};
