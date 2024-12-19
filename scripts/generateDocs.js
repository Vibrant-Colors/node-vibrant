import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateReferenceDocs } from "@tanstack/config/typedoc";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('@tanstack/config/typedoc').Package[]} */
const packages = [
	{
		name: "node-vibrant",
		entryPoints: [resolve(__dirname, "../packages/node-vibrant/src/index.ts")],
		tsconfig: resolve(__dirname, "../packages/node-vibrant/tsconfig.docs.json"),
		outputDir: resolve(__dirname, "../docs/reference"),
		exclude: [
			"packages/vibrant-core/**/*",
			"packages/vibrant-generator-default/**/*",
			"packages/vibrant-image-browser/**/*",
			"packages/vibrant-image-node/**/*",
			"packages/vibrant-quantizer-mmcq/**/*",
		],
	},
	{
		name: "vibrant-color",
		entryPoints: [resolve(__dirname, "../packages/vibrant-color/src/index.ts")],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-color/tsconfig.docs.json",
		),
		outputDir: resolve(__dirname, "../docs/package/vibrant-color/reference"),
	},
	{
		name: "vibrant-core",
		entryPoints: [resolve(__dirname, "../packages/vibrant-core/src/index.ts")],
		tsconfig: resolve(__dirname, "../packages/vibrant-core/tsconfig.docs.json"),
		outputDir: resolve(__dirname, "../docs/package/vibrant-core/reference"),
		exclude: [
			"packages/vibrant-color/**/*",
			"packages/vibrant-generator/**/*",
			"packages/vibrant-image/**/*",
			"packages/vibrant-quantizer/**/*",
			"packages/vibrant-types/**/*",
			"packages/vibrant-worker/**/*",
		],
	},
	{
		name: "vibrant-generator",
		entryPoints: [
			resolve(__dirname, "../packages/vibrant-generator/src/index.ts"),
		],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-generator/tsconfig.docs.json",
		),
		outputDir: resolve(
			__dirname,
			"../docs/package/vibrant-generator/reference",
		),
		exclude: ["packages/vibrant-color/**/*", "packages/vibrant-types/**/*"],
	},
	{
		name: "vibrant-generator-default",
		entryPoints: [
			resolve(__dirname, "../packages/vibrant-generator/src/index.ts"),
		],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-generator/tsconfig.docs.json",
		),
		outputDir: resolve(
			__dirname,
			"../docs/package/vibrant-generator-default/reference",
		),
		exclude: ["packages/vibrant-color/**/*", "packages/vibrant-generator/**/*"],
	},
	{
		name: "vibrant-image",
		entryPoints: [resolve(__dirname, "../packages/vibrant-image/src/index.ts")],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-image/tsconfig.docs.json",
		),
		outputDir: resolve(__dirname, "../docs/package/vibrant-image/reference"),
		exclude: ["packages/vibrant-color/**/*", "packages/vibrant-types/**/*"],
	},
	{
		name: "vibrant-image-browser",
		entryPoints: [resolve(__dirname, "../packages/vibrant-image/src/index.ts")],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-image/tsconfig.docs.json",
		),
		outputDir: resolve(
			__dirname,
			"../docs/package/vibrant-image-browser/reference",
		),
		exclude: ["packages/vibrant-image/**/*"],
	},
	{
		name: "vibrant-image-node",
		entryPoints: [resolve(__dirname, "../packages/vibrant-image/src/index.ts")],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-image/tsconfig.docs.json",
		),
		outputDir: resolve(
			__dirname,
			"../docs/package/vibrant-image-node/reference",
		),
		exclude: ["packages/vibrant-image/**/*"],
	},
	{
		name: "vibrant-quantizer",
		entryPoints: [
			resolve(__dirname, "../packages/vibrant-quantizer/src/index.ts"),
		],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-quantizer/tsconfig.docs.json",
		),
		outputDir: resolve(
			__dirname,
			"../docs/package/vibrant-quantizer/reference",
		),
		exclude: [
			"packages/vibrant-color/**/*",
			"packages/vibrant-image/**/*",
			"packages/vibrant-types/**/*",
		],
	},
	{
		name: "vibrant-quantizer-mmcq",
		entryPoints: [
			resolve(__dirname, "../packages/vibrant-quantizer/src/index.ts"),
		],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-quantizer/tsconfig.docs.json",
		),
		outputDir: resolve(
			__dirname,
			"../docs/package/vibrant-quantizer-mmcq/reference",
		),
		exclude: [
			"packages/vibrant-color/**/*",
			"packages/vibrant-image/**/*",
			"packages/vibrant-quantizer/**/*",
		],
	},
	{
		name: "vibrant-types",
		entryPoints: [resolve(__dirname, "../packages/vibrant-types/src/index.ts")],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-types/tsconfig.docs.json",
		),
		outputDir: resolve(__dirname, "../docs/package/vibrant-types/reference"),
	},
	{
		name: "vibrant-worker",
		entryPoints: [
			resolve(__dirname, "../packages/vibrant-worker/src/index.ts"),
		],
		tsconfig: resolve(
			__dirname,
			"../packages/vibrant-worker/tsconfig.docs.json",
		),
		outputDir: resolve(__dirname, "../docs/package/vibrant-worker/reference"),
		exclude: ["packages/vibrant-types/**/*"],
	},
];

await generateReferenceDocs({ packages });

process.exit(0);
