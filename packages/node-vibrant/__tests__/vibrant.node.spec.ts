import { afterAll, beforeAll, describe, it } from "vitest";

import { loadTestSamples } from "../../../fixtures/sample/loader";

import { createSampleServer } from "../../../fixtures/sample/server";

import { Vibrant } from "../src/node";
import { testVibrant } from "./common/helper";
import type http from "node:http";

const TEST_PORT = 3444;

const SAMPLES = loadTestSamples(TEST_PORT);

let server!: http.Server;

beforeAll(async () => {
	server = createSampleServer();
	await new Promise<void>((resolve) =>
		server.listen(TEST_PORT, () => resolve()),
	);
});

afterAll(
	async () =>
		await new Promise<void>((resolve, reject) =>
			server!.close((err) => {
				if (err) {
					return reject(err);
				}
				resolve();
			}),
		),
);

describe("Palette Extraction", () => {
	describe("process samples", () =>
		SAMPLES.forEach((sample) => {
			it(
				`${sample.name}`,
				testVibrant(Vibrant, sample, "filePath", "node"),
			);
		}));

	describe("process remote images (http)", function () {
		SAMPLES.forEach((sample) => {
			it(
				`${sample.url}`,
				testVibrant(Vibrant, sample, "url", "node"),
			);
		});
	});
});
