<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import { onMount } from "svelte";

  $: progress = "Loading...";
  let prompt = "What is the capital of canada?";

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
</div>
