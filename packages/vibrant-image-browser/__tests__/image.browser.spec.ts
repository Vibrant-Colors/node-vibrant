import { describe, expect, it } from "vitest";
import { loadTestSamples } from "../../../fixtures/sample/loader";
import { BrowserImage } from "../src";

const SAMPLES = loadTestSamples();

describe.skip("Browser Image", () => {
	const loc = window.location;
	const CROS_URL = "https://avatars3.githubusercontent.com/u/922715?v=3&s=460";
	const RELATIVE_URL = SAMPLES[0]!.relativeUrl;
	const SAME_ORIGIN_URL = `${loc.protocol}//${loc.host}/${RELATIVE_URL}`;

	it.skip("should set crossOrigin flag for images form foreign origin", async () => {
		const m = await new BrowserImage().load(CROS_URL);
		expect(
			(m as any).image.crossOrigin,
			`${CROS_URL} should have crossOrigin === 'anonymous'`,
		).to.equal("anonymous");
		expect(m.getImageData()).to.be.an.instanceOf(ImageData);
	});

	it("should not set crossOrigin flag for images from same origin (relative URL)", async () => {
		const m = await new BrowserImage().load(RELATIVE_URL);
		expect(
			(m as any).image.crossOrigin,
			`${RELATIVE_URL} should not have crossOrigin set`,
		).not.to.equal("anonymous");
	});

	it("should not set crossOrigin flag for images from same origin (absolute URL)", async () => {
		const m = await new BrowserImage().load(SAME_ORIGIN_URL);
		expect(
			(m as any).image.crossOrigin,
			`${SAME_ORIGIN_URL} should not have crossOrigin set`,
		).not.to.equal("anonymous");
	});

	it("should accept HTMLImageElement as input", async () => {
		const img = document.createElement("img");
		img.src = SAMPLES[0]!.relativeUrl;

		const m1 = new BrowserImage();
		await m1.load(img);
	});

	it("should accept HTMLImageElement that is already loaded as input", async () => {
		const img = document.createElement("img");
		img.src = SAMPLES[0]!.relativeUrl;

		let resolve = () => {};
		const prom = new Promise<void>((r) => (resolve = r));
		img.onload = () => {
			const m1 = new BrowserImage();
			m1.load(img).then(() => resolve());
		};

		await prom;
	});
});
