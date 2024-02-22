<script lang="ts">
  import { agentExecutorBuilder } from "@src/bees/agentExecutorBuilder";
  import { beeBuilder } from "@src/bees/beeBuilder";
  import type { WorldState } from "@src/bees/types";
  import { onMount } from "svelte";

  export let state: WorldState;

  const changeSpeed = (e: Event) => {
    console.log("changeSpeed", (e.target as HTMLInputElement).valueAsNumber);
    state.controls.speed = (e.target as HTMLInputElement).valueAsNumber;
  };

  let agentExecutor: Awaited<ReturnType<typeof agentExecutorBuilder>>;
  onMount(async () => {
    agentExecutor = await agentExecutorBuilder(state);
  });

  const addBeeViaLLM = async () => {
    const bee = await agentExecutor.invoke({
      prompt: "Add one bee to the map.",
    });
    console.log("bee results", bee);
  };
</script>

<div class="flex flex-col gap-2">
  <p class="control-section-header">Bees</p>
  <button
    class="btn"
    on:click={() => {
      state.objects.push(beeBuilder({}, state));
    }}>Add Bee</button
  >

  <button
    class="btn"
    on:click={() => {
      addBeeViaLLM();
    }}>Add Bee Via LLM</button
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
