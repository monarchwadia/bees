<script lang="ts">
  import { getDeep, setDeep } from "./utils";

  export let path: string;
  export let state: any;
  export let min: number;
  export let max: number;
  export let step: number;
  export let label: string;

  const value = getDeep(state, path);
  const onInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).valueAsNumber;
    setDeep(state, path, value);
  };
</script>

<label>
  {label}
  <input type="range" {min} {max} {step} {value} on:input={onInput} />
</label>
