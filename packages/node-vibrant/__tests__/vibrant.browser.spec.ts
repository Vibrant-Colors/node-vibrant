import { commands } from "@vitest/browser/context";
import { afterAll, beforeAll, describe, it } from "vitest";

import { Vibrant } from "../src/browser";
import { testVibrant } from "./common/helper";

import type { TestSample } from "../../../fixtures/sample/loader";

beforeAll(async () => {
	await commands.startServer();
});

afterAll(async () => {
	await commands.stopServer();
});

describe("Palette Extraction", async () => {
	const SAMPLES = await commands.loadSamples();

	SAMPLES.forEach((example) => {
		it(`${example.name}`, testVibrant(Vibrant, example, "url", "browser"));
	});
});

declare module "@vitest/browser/context" {
	interface BrowserCommands {
		loadSamples: () => Promise<TestSample[]>;
		startServer: () => Promise<void>;
		stopServer: () => Promise<void>;
	}
}
