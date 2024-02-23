<script lang="ts">
  import type { WorldState } from "./bees/types";
  import { GameManager } from "./bees/GameManager";
  import { onMount } from "svelte";
  import MapView from "./lib/MapView.svelte";
  import { beeBuilder } from "./bees/beeBuilder";
  import Controls from "./lib/Controls.svelte";
  import { trailPointBuilder } from "./bees/trailPointBuilder";
  import { flowerBuilder } from "./bees/flowerBuilder";
  import ChatAgent from "./lib/ChatAgent.svelte";

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
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));
  state.objects.push(beeBuilder({ x: 800, y: 600 }, state));

  // initial flowers
  state.objects.push(flowerBuilder({ x: 100, y: 100 }, state));
  state.objects.push(beeBuilder({ x: 100, y: 100 }, state));

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
  <ChatAgent />
</div>
