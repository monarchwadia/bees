<script lang="ts">
  import { requestAgent } from "@ai/agentExecutorBuilder";
  import type { WorldState } from "@src/bees/types";
  const VITE_OPENAI_CREDS = import.meta.env.VITE_OPENAI_CREDS;

  export let state: WorldState;

  let inputVal: string = "";
  let memoryRef: Awaited<ReturnType<typeof requestAgent>>["memory"];

  const onSubmit = async (e: Event) => {
    console.log("onSubmit");
    e.preventDefault();
    if (inputVal) {
      const { memory } = await requestAgent(inputVal, state);
      memoryRef = memory;
    }
  };
</script>

<form on:submit={onSubmit}>
  Key: {VITE_OPENAI_CREDS}
  <input type="text" bind:value={inputVal} />
  <input type="submit" />
</form>
