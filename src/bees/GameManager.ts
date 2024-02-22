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
      b.x += Math.random() * 10 - 5;
      b.y += Math.random() * 10 - 5;
    });
  }
}
