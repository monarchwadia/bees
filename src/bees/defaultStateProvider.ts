import type { WorldState } from "@bees/types";
import { beeBuilder } from "@bees/beeBuilder";
import { flowerBuilder } from "@bees/flowerBuilder";

export const defaultStateProvider = () => {
  const config = {
    width: 800,
    height: 800,
  };

  const state: WorldState = {
    config,
    hive: {
      pollen: 0,
    },
    controls: {
      isRunning: true,
      speed: 100,
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
