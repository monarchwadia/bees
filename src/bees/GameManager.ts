import type { WorldState } from "./types";

export class GameManager {
  state: WorldState;

  constructor(state: WorldState) {
    this.state = state;
  }

  start() {
    setInterval(() => {
      this.tick();
    }, 1000 / 30);
  }

  tick() {
    this.state.bees.forEach((b) => {
      console.log(b);
      b.ai(b);
    });
  }
}
