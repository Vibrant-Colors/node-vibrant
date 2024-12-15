import { defineConfig, mergeConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/config/vite";

const config = defineConfig({
  base: "./",
});

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: ["./src/index.ts", "./src/browser.ts", "./src/worker.ts"],
    srcDir: "./src",
  })
);
