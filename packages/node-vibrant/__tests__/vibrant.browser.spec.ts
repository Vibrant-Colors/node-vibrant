import { commands } from "@vitest/browser/context";
import { afterAll, beforeAll, describe, it } from "vitest";

import { testVibrant, testVibrantAsPromised } from "./common/helper";

import Vibrant from "../src/worker";
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
		it(
			`${example.name} (callback)`,
			testVibrant(Vibrant, example, "url", "browser"),
		);
		it(
			`${example.name} (Promise)`,
			testVibrantAsPromised(Vibrant, example, "url", "browser"),
		);
	});
});

declare module "@vitest/browser/context" {
	interface BrowserCommands {
		loadSamples: () => Promise<TestSample[]>;
		startServer: () => Promise<void>;
		stopServer: () => Promise<void>;
	}
}
