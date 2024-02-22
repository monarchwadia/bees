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
      switch (obj.type) {
        case "bee":
          obj.ai(obj, this.state);
          break;
        case "trail-point":
          obj.ai(obj, this.state);
          break;
        case "flower":
          break;
      }
    });
  }
}
