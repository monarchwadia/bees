<script lang="ts">
  import type { WorldState } from "./bees/types";
  import { GameManager } from "./bees/GameManager";
  import { onMount } from "svelte";
  import MapView from "./lib/MapView.svelte";
  import { beeBuilder } from "./bees/beeBuilder";
  import Controls from "./lib/Controls.svelte";
  import { trailPointBuilder } from "./bees/trailPointBuilder";

  let output: HTMLDivElement;

  const config = {
    width: 800,
    height: 800,
  };

  const state: WorldState = {
    config,
    controls: {
      isRunning: true,
      speed: 100,
    },
    objects: [],
  };

  // initial bees
  state.objects.push(beeBuilder({}, state));
  state.objects.push(beeBuilder({}, state));
  state.objects.push(beeBuilder({}, state));
  state.objects.push(beeBuilder({}, state));

  // initial flowers
  for (let i = 0; i < 400; i++) {
    state.objects.push(trailPointBuilder({ x: i, y: i }, state));
  }

  // trails for bees
  state.objects.push();

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
