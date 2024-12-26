// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		starlight({
			title: "Vibrant Colors",
			social: {
				github: "https://github.com/withastro/starlight",
			},
			components: {
				Head: "./src/components/head.astro",
				Hero: "./src/components/hero.astro"
			},
			customCss: ["./src/styles/global.css"],
			sidebar: [
				{
					label: "Guides",
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: "Example Guide", slug: "guides/example" },
					],
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
