import type p5 from "p5";
import type { WorldState } from "./types";

export const sketchProvider = (state: WorldState) => (p: p5) => {
  p.setup = () => {
    p.createCanvas(state.config.width, state.config.height);
  };

  p.draw = () => {
    p.background(0);

    // paint the bees
    state.bees.forEach((b) => {
      p.fill(...b.color);
      p.rect(b.x, b.y, 10, 10);
    });
  };
};
