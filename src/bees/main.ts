import p5 from "p5";
import type { WorldState } from "./types";
import { sketchProvider } from "./sketchProvider";
import { GameManager } from "./GameManager";

const config = {
  width: 800,
  height: 800,
};
const centerpoint = { x: config.width / 2, y: config.height / 2 };

const state: WorldState = {
  config,
  bees: [
    { id: 1, ...centerpoint, color: [255, 255, 0] },
    { id: 2, ...centerpoint, color: [255, 0, 255] },
    { id: 3, ...centerpoint, color: [0, 255, 255] },
    { id: 4, ...centerpoint, color: [0, 0, 255] },
  ],
};

const sketch = sketchProvider(state);
const gameManager = new GameManager(state);
gameManager.start();

const instance = new p5(sketch, document.body);
