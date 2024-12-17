import { NodeImage } from "@vibrant/image-node";
import { Vibrant } from "./configs/config";
import { pipeline } from "./pipeline";

Vibrant.DefaultOpts.ImageClass = NodeImage;
Vibrant.use(pipeline);

export { Vibrant };
