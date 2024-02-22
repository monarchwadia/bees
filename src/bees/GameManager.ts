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
    this.state.objects.forEach((b) => {
      switch (b.type) {
        case "bee":
          b.ai(b, this.state);
          break;
        case "flower":
          break;
        case "trail-point":
          break;
      }
    });
  }
}
