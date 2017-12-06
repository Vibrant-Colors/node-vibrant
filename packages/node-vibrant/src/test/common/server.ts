import Promise = require('bluebird')
import path = require('path')
import http = require('http')
import finalhandler = require('finalhandler')
import serveStatic = require('serve-static')

const staticFiles = serveStatic(path.join(__dirname, '../../../data/'))
const serverHandler = (req: http.ServerRequest, res: http.ServerResponse) => {
    let done = finalhandler(req, res)
    return staticFiles(<any>req, <any>res, done)
}

export const createSampleServer = () => {
    let server = http.createServer(serverHandler)

    Promise.promisify(server.listen)
    Promise.promisify(server.close)
    return server
}

