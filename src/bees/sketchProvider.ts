import type p5 from "p5";
import type { WorldState } from "./types";
import { FLOWER_STARTING_POLLEN } from "./constants";

export const sketchProvider = (state: WorldState) => (p: p5) => {
  p.setup = () => {
    p.createCanvas(state.config.mapWidth, state.config.mapHeight);
  };

  p.draw = () => {
    p.background(0);

    // paint the hive in the center
    p.fill([185, 125, 0]);
    p.ellipse(state.config.mapWidth / 2, state.config.mapHeight / 2, 30, 30);

    // paint objects
    state.objects.forEach((obj) => {
      switch (obj.type) {
        case "trail-point": {
          // trail strength is from 1 to 100
          const opacity = Math.floor((obj.strength / 100) * 255);
          p.fill([185, 100, 100, opacity]);
          p.ellipse(obj.x, obj.y, 5);
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
`,
      20,
      20
    );
  };
};
