<script lang="ts">
  import p5 from "p5";
  import type { WorldState } from "./bees/types";
  import { sketchProvider } from "./bees/sketchProvider";
  import { GameManager } from "./bees/GameManager";
  import { onMount } from "svelte";

  let output: HTMLDivElement;

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

  let instance;

  onMount(() => {
    const sketch = sketchProvider(state);
    instance = new p5(sketch, output);
    const gameManager = new GameManager(state);
    gameManager.start();
  });
</script>

<div class="flex flex-col gap-2">
  <h1>Hello World!</h1>
  <div bind:this={output}></div>
</div>
