<script lang="ts">
  import type { WorldState } from "./bees/types";
  import { GameManager } from "./bees/GameManager";
  import { onMount } from "svelte";
  import MapView from "./lib/MapView.svelte";
  import { beeBuilder } from "./bees/beeBuilder";
  import Controls from "./lib/Controls.svelte";

  let output: HTMLDivElement;

  const config = {
    width: 800,
    height: 800,
  };

  const state: WorldState = {
    config,
    controls: {
      isRunning: true,
      speed: 10,
    },
    bees: [],
  };

  // initial bees
  state.bees.push(beeBuilder({}, state));
  state.bees.push(beeBuilder({}, state));
  state.bees.push(beeBuilder({}, state));
  state.bees.push(beeBuilder({}, state));

  let instance;

  onMount(() => {
    const gameManager = new GameManager(state);
    gameManager.loop();
  });
</script>

<div class="flex flex-row gap-2">
  <MapView {state} />
  <Controls {state} />
</div>
