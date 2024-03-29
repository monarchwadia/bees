import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@src": "/src",
      "@bees": "/src/bees",
      "@lib": "/src/lib",
      "@ai": "/src/ai",
    },
  },
});
