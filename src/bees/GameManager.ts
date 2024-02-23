import { flowerBuilder } from "./flowerBuilder";
import type { WorldState } from "./types";

export class GameManager {
  state: WorldState;

  constructor(state: WorldState) {
    this.state = state;
  }

  loop() {
    setTimeout(() => {
      if (this.state.controls.isRunning && this.state.controls.speed > 0) {
        this.updateState();
      }

      this.loop();
    }, 1000 / this.state.controls.speed);
  }

  updateState() {
    this.state.objects.forEach((obj) => {
      obj.ai(obj, this.state);
    });

    // once in a while, generate a flower
    if (Math.random() < 0.001) {
      this.state.objects.push(
        flowerBuilder(
          {
            x: Math.round(Math.random() * this.state.config.width),
            y: Math.round(Math.random() * this.state.config.height),
          },
          this.state
        )
      );
    }
  }
}
