import { defineWorkspace } from "vitest/config";
import { BrowserCommand } from "vitest/node";

import { loadTestSamples } from "../../fixtures/sample/loader";
import { createSampleServer } from "../../fixtures/sample/server";
import http from "http";

const TEST_PORT = 4555;

const loadSamples: BrowserCommand<never> = ({}) => {
	const SAMPLES = loadTestSamples(TEST_PORT);
	return SAMPLES;
};

let server: http.Server | null = null;

const startServer: BrowserCommand<never> = async ({}) => {
	server = createSampleServer();
	await new Promise<void>((resolve) =>
		server.listen(TEST_PORT, () => resolve()),
	);
	return null;
};

const stopServer: BrowserCommand<never> = async ({}) =>
	new Promise<void>((resolve, reject) =>
		server!.close((err) => {
			if (err) return reject(err);
			resolve();
		}),
	);

export default defineWorkspace([
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
				provider: "playwright",
				enabled: true,
				name: "chromium",
				headless: true,
				providerOptions: {},
				commands: {
					loadSamples,
					stopServer,
					startServer,
				},
			},
		},
	},
]);
