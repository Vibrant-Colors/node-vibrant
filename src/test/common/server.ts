import path = require('path')
import http = require('http')
import util = require('util')
import finalhandler = require('finalhandler')
import serveStatic = require('serve-static')

const staticFiles = serveStatic(path.join(__dirname, '../../../data/'))
const serverHandler = (req: http.ServerRequest, res: http.ServerResponse) => {
    let done = finalhandler(req, res)
    return staticFiles(<any>req, <any>res, done)
}

export const createSampleServer = () => {
    let server = http.createServer(serverHandler) as any

    server.listen = util.promisify(server.listen)
    server.close = util.promisify(server.close)
    return server as http.Server;
}
