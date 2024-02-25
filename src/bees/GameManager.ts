import { beeBuilder } from "./beeBuilder";
import { GLOBAL_MAP_HEIGHT, GLOBAL_MAP_WIDTH, NEW_BEE_COST } from "./constants";
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
        for (let i = 0; i < this.state.controls.speed; i++) {
          this.updateState();
        }
      }

      this.loop();
    }, 1);
  }

  updateState() {
    this.state.objects.forEach((obj) => {
      obj.ai(obj, this.state);
    });

    // once in a while, generate a flower
    if (Math.random() < this.state.config.flower.creationChance) {
      this.state.objects.push(
        flowerBuilder(
          {
            x: Math.round(Math.random() * GLOBAL_MAP_WIDTH),
            y: Math.round(Math.random() * GLOBAL_MAP_HEIGHT),
          },
          this.state
        )
      );
    }

    // if the hive has enough pollen, create a bee
    const minQuantity =
      NEW_BEE_COST + this.state.config.hive.pollenStockpileMinimum;
    if (this.state.hive.pollen >= minQuantity) {
      this.state.objects.push(beeBuilder({}, this.state));
      this.state.hive.pollen -= NEW_BEE_COST;
    }
  }
}
