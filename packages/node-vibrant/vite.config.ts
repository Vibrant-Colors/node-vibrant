import { defineConfig, mergeConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/config/vite";

const config = defineConfig({
  base: "./",
});

export default mergeConfig(
  config,
  tanstackViteConfig({
    entry: [
      "./src/node.ts",
      "./src/browser.ts",
      "./src/worker.ts",
      "./src/throw.ts",
    ],
    srcDir: "./src",
  })
);
