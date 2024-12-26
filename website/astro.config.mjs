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
			logo: {
				src: "./public/favicon.svg",
				alt: "A color picker on two sides of a sunset",
			},
			social: {
				github: "https://github.com/vibrant-colors/node-vibrant",
			},
			components: {
				Head: "./src/components/head.astro",
				Hero: "./src/components/hero.astro",
				SiteTitle: "./src/components/site-title.astro",
				PageTitle: "./src/components/page-title.astro",
			},
			customCss: ["./src/styles/global.css"],
			sidebar: [
				{
					label: "Guides",
					items: [{ label: "Getting Started", slug: "guides/get-started" }],
				},
				{
					label: "Reference",
					collapsed: true,
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],
});
