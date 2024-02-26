import { beeBuilder } from "./beeBuilder";
import { flowerBuilder } from "./flowerBuilder";
import { trailPointBuilder } from "./trailPointBuilder";
import type { WorldState } from "./types";
import type p5 from "p5";

export const buildClickHandler = (p: p5, state: WorldState) => () => {
  switch (state.controls.brush) {
    case "bee":
      state.objects.push(beeBuilder({ x: p.mouseX, y: p.mouseY }, state));
      break;
    case "flower":
      state.objects.push(flowerBuilder({ x: p.mouseX, y: p.mouseY }, state));
      break;
    case "trail-point":
      state.objects.push(
        trailPointBuilder({ x: p.mouseX, y: p.mouseY }, state)
      );
      break;
    case "erase":
      state.objects = state.objects.filter((obj) => {
        const distance = Math.sqrt(
          Math.pow(obj.x - p.mouseX, 2) + Math.pow(obj.y - p.mouseY, 2)
        );
        return distance > 20;
      });
      break;
  }
};
