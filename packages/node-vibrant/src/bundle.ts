import Vibrant = require('./browser')
import pipeline from './pipeline'

Vibrant.use(pipeline)
;

((ns: any) => {
    ns.Vibrant = Vibrant
})((typeof window === 'object' && window instanceof Window) ? window: module.exports)