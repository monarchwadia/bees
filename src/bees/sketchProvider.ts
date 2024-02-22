import type p5 from "p5";
import type { WorldState } from "./types";

export const sketchProvider = (state: WorldState) => (p: p5) => {
  p.setup = () => {
    p.createCanvas(state.config.width, state.config.height);
  };

  p.draw = () => {
    p.background(0);

    // paint the bees
    state.objects.forEach((obj) => {
      switch (obj.type) {
        case "bee":
          p.fill([255, 255, 0]);
          p.rect(obj.x, obj.y, 10, 10);
          break;
        case "flower":
          p.fill([255, 125, 125]);
          p.ellipse(obj.x, obj.y, 20, 20);
          break;
        case "trail-point":
          p.fill([255, 255, 255]);
          p.ellipse(obj.x, obj.y, 5);
          break;
      }
    });
  };
};
