<script lang="ts">
  import { requestAgent } from "@ai/agentExecutorBuilder";
  import { beeBuilder } from "@src/bees/beeBuilder";
  import { flowerBuilder } from "@src/bees/flowerBuilder";
  import type { WorldState } from "@src/bees/types";
  import { onMount } from "svelte";
  import SliderControl from "./SliderControl.svelte";

  export let state: WorldState;

  const addBeeViaLLM = async () => {
    await requestAgent(
      "Choose a flower from the state object and add a bee with the same coordinates as that flower, such that the bee will be spawned on top of the flower.",
      state
    );
  };

  const changeBrush = (brush: WorldState["controls"]["brush"]) => () => {
    state.controls.brush = brush;
  };
</script>

<div class="flex flex-col gap-2">
  <p class="control-section-header">Brushes</p>
  <button class="btn" on:click={changeBrush("bee")}>Bee</button>
  <button class="btn" on:click={changeBrush("flower")}>Flower</button>
  <button class="btn" on:click={changeBrush("trail-point")}>TrailPoint</button>
  <button class="btn" on:click={changeBrush("erase")}>Erase</button>

  <p class="control-section-header">Test</p>
  <button
    class="btn"
    on:click={() => {
      state.objects.push(flowerBuilder({}, state));
    }}>Add Flower</button
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

  <p class="control-section-header">Bee</p>
  <SliderControl
    path="controls.speed"
    {state}
    min={1}
    max={100}
    step={1}
    label="Speed"
  />
  <SliderControl
    path="config.bee.flightRandomness"
    {state}
    min={1}
    max={100}
    step={1}
    label="Flight Randomness"
  />
  <SliderControl
    path="config.bee.objectDetectionRange"
    {state}
    min={1}
    max={100}
    step={1}
    label="Object Detection Range"
  />
  <SliderControl
    path="config.bee.objectInteractionRange"
    {state}
    min={1}
    max={100}
    step={1}
    label="Object Interaction Range"
  />
  <SliderControl
    path="config.bee.trailPointAttraction"
    {state}
    min={1}
    max={100}
    step={1}
    label="Trail Point Attraction"
  />
  <SliderControl
    path="config.bee.rotationSpeedMin"
    {state}
    min={0.001}
    max={0.01}
    step={0.001}
    label="Rotation Speed Min"
  />
  <SliderControl
    path="config.bee.rotationSpeedMax"
    {state}
    min={0.001}
    max={0.01}
    step={0.001}
    label="Rotation Speed Max"
  />
  <SliderControl
    path="config.bee.trailPointDropChance"
    {state}
    min={0.1}
    max={1}
    step={0.1}
    label="Trail Point Drop Chance"
  />
  <SliderControl
    path="config.bee.hungerFeedingThreshold"
    {state}
    min={1}
    max={100}
    step={1}
    label="Hunger Feeding Threshold"
  />
  <SliderControl
    path="config.bee.trailpointCreationMinStrength"
    {state}
    min={1}
    max={1000}
    step={1}
    label="Trailpoint Creation Min Strength"
  />
  <SliderControl
    path="config.bee.trailpointCreationMaxStrength"
    {state}
    min={1}
    max={1000}
    step={1}
    label="Trailpoint Creation Max Strength"
  />
  <p class="control-section-header">Flower</p>
  <SliderControl
    path="config.flower.creationChance"
    {state}
    min={0}
    max={0.01}
    step={0.0005}
    label="Creation Chance"
  />
  <p class="control-section-header">Hive</p>
  <SliderControl
    path="config.hive.pollenStockpileMinimum"
    {state}
    min={0}
    max={500}
    step={1}
    label="Pollen Stockpile Minimum"
  />
</div>

<style lang="postcss">
  .control-section-header {
    @apply font-bold;
    @apply text-2xl;
  }
</style>
