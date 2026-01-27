import { server } from "vitest/browser";
import { afterAll, beforeAll, describe, it } from "vitest";

import { Vibrant } from "../src/browser";
import { testVibrant } from "./common/helper";

import type { TestSample } from "../../../fixtures/sample/loader";

beforeAll(async () => {
	await server.commands.startServer();
});

afterAll(async () => {
	await server.commands.stopServer();
});

describe("Palette Extraction", async () => {
	const SAMPLES = await server.commands.loadSamples();

	SAMPLES.forEach((example) => {
		it(`${example.name}`, testVibrant(Vibrant, example, "url", "browser"));
	});
});

declare module "vitest/browser" {
	interface BrowserCommands {
		loadSamples: () => Promise<TestSample[]>;
		startServer: () => Promise<void>;
		stopServer: () => Promise<void>;
	}
}
