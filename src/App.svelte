<script lang="ts">
  import type { WorldState } from "./bees/types";
  import { GameManager } from "./bees/GameManager";
  import { onMount } from "svelte";
  import MapView from "./lib/MapView.svelte";
  import { beeBuilder } from "./bees/beeBuilder";

  let output: HTMLDivElement;

  const config = {
    width: 800,
    height: 800,
  };

  const centerpoint = {
    x: config.width / 2,
    y: config.height / 2,
  };

  const state: WorldState = {
    config,
    bees: [
      beeBuilder({ ...centerpoint }),
      beeBuilder({ ...centerpoint }),
      beeBuilder({ ...centerpoint }),
      beeBuilder({ ...centerpoint }),
    ],
  };
  let instance;

  onMount(() => {
    const gameManager = new GameManager(state);
    gameManager.start();
  });
</script>

<div class="flex flex-col gap-2">
  <h1>Hello World!</h1>
  <MapView {state} />
</div>
