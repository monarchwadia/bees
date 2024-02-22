<script lang="ts">
  import { beeBuilder } from "@src/bees/beeBuilder";
  import type { WorldState } from "@src/bees/types";

  export let state: WorldState;

  const changeSpeed = (e: Event) => {
    console.log("changeSpeed", (e.target as HTMLInputElement).valueAsNumber);
    state.controls.speed = (e.target as HTMLInputElement).valueAsNumber;
  };
</script>

<div class="flex flex-col gap-2">
  <p class="control-section-header">Bees</p>
  <button
    class="btn"
    on:click={() => {
      state.bees.push(beeBuilder({}, state));
    }}>Add Bee</button
  >

  <p class="control-section-header">Game</p>
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

<style lang="postcss">
  .control-section-header {
    @apply font-bold;
    @apply text-2xl;
  }
</style>
