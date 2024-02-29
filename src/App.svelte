<script lang="ts">
  import p5 from "p5";
  import type { WorldState } from "./bees/types";
  import Controls from "./lib/Controls.svelte";
  import { defaultStateProvider } from "./bees/defaultStateProvider";
  import { onMount } from "svelte";
  import { GameManager } from "./bees/GameManager";
  import { sketchProvider } from "./bees/sketchProvider";
  import Chat from "./lib/Chat.svelte";
  const state: WorldState = defaultStateProvider();

  let elem: HTMLDivElement;
  let instant;

  onMount(() => {
    const gameManager = new GameManager(state);
    gameManager.loop();
    const sketch = sketchProvider(state);
    instant = new p5(sketch, elem);
  });
</script>

<div class="flex flex-row gap-2">
  <div bind:this={elem}></div>
  <Controls {state} />
</div>
