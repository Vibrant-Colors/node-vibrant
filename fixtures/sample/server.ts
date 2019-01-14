import path = require('path')
import http = require('http')
import finalhandler = require('finalhandler')
import serveStatic = require('serve-static')

const staticFiles = serveStatic(path.join(__dirname, './images/'))
const serverHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  let done = finalhandler(req, res)
  return staticFiles(req as any, res as any, done)
}

export const createSampleServer = () => http.createServer(serverHandler)
