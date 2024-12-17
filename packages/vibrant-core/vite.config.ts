import { defineConfig, mergeConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/config/vite";

const config = defineConfig({});

export default mergeConfig(
	config,
	tanstackViteConfig({
		entry: "./src/index.ts",
		srcDir: "./src",
	}),
);
