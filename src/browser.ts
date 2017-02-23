import Vibrant from './vibrant'
import BrowserImage from './image/browser'

Vibrant.DefaultOpts.ImageClass = BrowserImage;

((ns: any) => {
    ns.Vibrant = Vibrant
})((typeof window === 'object' && window instanceof Window) ? window: module.exports) 