<script lang="ts">
  import type { WorldState } from "@src/bees/types";

  export let state: WorldState;

  const changeSpeed = (e: Event) => {
    console.log("changeSpeed", (e.target as HTMLInputElement).valueAsNumber);
    state.controls.speed = (e.target as HTMLInputElement).valueAsNumber;
  };
</script>

<div class="flex flex-col gap-2">
  <button
    class="btn"
    on:click={() => (state.controls.isRunning = !state.controls.isRunning)}
    >Start/Stop</button
  >
  <label for="speed">
    Speed
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      value={state.controls.speed}
      on:change={changeSpeed}
    />
  </label>
</div>
