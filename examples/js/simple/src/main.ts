import { Vibrant } from "node-vibrant/browser";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <p>Loading...</p>
`;

Vibrant.from("https://avatars.githubusercontent.com/Vibrant-Colors")
	.getPalette()
	.then((palette) => {
		app.innerHTML = `
      <img src="https://avatars.githubusercontent.com/Vibrant-Colors" alt=""/>
      <ul>
        <li style="background-color: ${palette.Vibrant?.hex}; color: ${palette.Vibrant?.bodyTextColor};">Vibrant</li>
        <li style="background-color: ${palette.LightVibrant?.hex}; color: ${palette.LightVibrant?.bodyTextColor};">Light Vibrant</li>
        <li style="background-color: ${palette.DarkVibrant?.hex}; color: ${palette.DarkVibrant?.bodyTextColor};">Dark Vibrant</li>
        <li style="background-color: ${palette.Muted?.hex}; color: ${palette.Muted?.bodyTextColor};">Muted</li>
        <li style="background-color: ${palette.LightMuted?.hex}; color: ${palette.LightMuted?.bodyTextColor};">Light Muted</li>
        <li style="background-color: ${palette.DarkMuted?.hex}; color: ${palette.DarkMuted?.bodyTextColor};">Dark Muted</li>
      </ul>
    `;
	});
