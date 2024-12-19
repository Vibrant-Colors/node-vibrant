import { defineConfig, mergeConfig } from "vite";
// @ts-ignore
import { tanstackViteConfig } from "@tanstack/config/vite";

const config = defineConfig({});

export default mergeConfig(
	config,
	tanstackViteConfig({
		entry: "./src/index.ts",
		srcDir: "./src",
	}),
);
