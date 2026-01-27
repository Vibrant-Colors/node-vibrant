import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

import { loadTestSamples } from "../../fixtures/sample/loader";
import { createSampleServer } from "../../fixtures/sample/server";
import type { BrowserCommand } from "vitest/node";
import type http from "node:http";

const TEST_PORT = 4555;

const loadSamples: BrowserCommand<never[]> = ({}) => {
	const SAMPLES = loadTestSamples(TEST_PORT);
	return SAMPLES;
};

let server: http.Server | null = null;

const startServer: BrowserCommand<never[]> = async ({}) => {
	server = createSampleServer();
	await new Promise<void>((resolve) =>
		server!.listen(TEST_PORT, () => resolve()),
	);
	return null;
};

const stopServer: BrowserCommand<never[]> = async ({}) =>
	new Promise<void>((resolve, reject) =>
		server!.close((err) => {
			if (err) return reject(err);
			resolve();
		}),
	);

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					include: ["__tests__/**/*.node.{test,spec}.ts"],
					name: "node",
					environment: "node",
				},
			},
			{
				test: {
					include: ["__tests__/**/*.browser.{test,spec}.ts"],
					name: "browser",
					browser: {
						provider: playwright(),
						enabled: true,
						instances: [{ browser: "chromium", headless: true }],
						commands: {
							loadSamples,
							stopServer,
							startServer,
						},
					},
				},
			},
		],
	},
});
