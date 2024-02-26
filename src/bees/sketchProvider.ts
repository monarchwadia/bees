import type p5 from "p5";
import type { WorldState } from "./types";
import {
  FLOWER_STARTING_POLLEN,
  GLOBAL_MAP_HEIGHT,
  GLOBAL_MAP_WIDTH,
} from "./constants";
import { beeBuilder } from "./beeBuilder";
import { flowerBuilder } from "./flowerBuilder";
import { buildClickHandler } from "./clickHandler";

export const sketchProvider = (state: WorldState) => (p: p5) => {
  let canvas: p5.Renderer;

  p.setup = () => {
    canvas = p.createCanvas(GLOBAL_MAP_WIDTH, GLOBAL_MAP_HEIGHT);
    canvas.mouseClicked(buildClickHandler(p, state));
  };

  p.draw = () => {
    p.background(0);
    // paint the hive in the center
    p.fill([185, 125, 0]);
    p.ellipse(GLOBAL_MAP_WIDTH / 2, GLOBAL_MAP_HEIGHT / 2, 30, 30);

    // paint objects
    state.objects.forEach((obj) => {
      switch (obj.type) {
        case "trail-point": {
          const minOpacity = 55;
          const opacity = Math.floor(
            (obj.strength / state.config.bee.trailpointCreationMaxStrength) *
              (255 - minOpacity) +
              minOpacity
          );
          p.fill([185, 100, 100, opacity]);
          p.ellipse(obj.x, obj.y, 4);
          break;
        }
        case "bee":
          p.fill([255, 255, 0]);
          p.rect(obj.x, obj.y, 10, 10);
          break;
        case "flower": {
          const opacity = (obj.pollen / FLOWER_STARTING_POLLEN) * 255;
          p.fill([255, 125, 125, opacity]);
          p.ellipse(obj.x, obj.y, 20, 20);
          break;
        }
      }
    });

    // paint stats
    p.fill(255);
    const numBees = state.objects.filter((obj) => obj.type === "bee").length;
    p.textSize(20);
    p.text(
      `Bees: ${numBees}
Pollen: ${state.hive.pollen}
FPS: ${p.frameRate().toFixed(2)}
Brush: ${state.controls.brush}
`,
      20,
      20
    );
  };
};
