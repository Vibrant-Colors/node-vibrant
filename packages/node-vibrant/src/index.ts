import Vibrant from './config'
import NodeImage from '@vibrant/image-node'
import pipeline from './pipeline'

Vibrant.DefaultOpts.ImageClass = NodeImage
Vibrant.use(pipeline)

export = Vibrant
