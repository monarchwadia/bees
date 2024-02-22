<script lang="ts">
  import p5 from "p5";
  import type { WorldState } from "@src/bees/types";
  import { sketchProvider } from "@src/bees/sketchProvider";
  import { onMount } from "svelte";

  export let state: WorldState;
  let elem: HTMLDivElement;
  let instant;

  onMount(() => {
    const sketch = sketchProvider(state);
    instant = new p5(sketch, elem);
  });
</script>

<div bind:this={elem}></div>
