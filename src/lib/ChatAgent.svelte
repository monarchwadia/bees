<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import { onMount } from "svelte";

  $: progress = "Loading...";
  $: prompt = "What is the capital of canada?";

  const chat = new webllm.ChatModule();
  chat.setInitProgressCallback((report) => {
    progress = report.text;
  });

  onMount(async () => {
    await chat.reload("RedPajama-INCITE-Chat-3B-v1-q4f32_1");
    await chat.generate("What is the capital of canada?", (_step, message) => {
      progress = message;
    });
  });
</script>

<div>
  <p>{progress}</p>
  <form
    on:submit|preventDefault={async () => {
      await chat.generate(prompt, (_step, message) => {
        progress = message;
      });
    }}
  >
    <input type="text" bind:value={prompt} />
    <button type="submit">Send</button>
  </form>
</div>
