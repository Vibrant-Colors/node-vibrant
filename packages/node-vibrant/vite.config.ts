import { defineConfig, mergeConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/vite-config";

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
			"./src/worker.worker.ts",
			"./src/throw.ts",
		],
		srcDir: "./src",
	}),
);
