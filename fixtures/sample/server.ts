import * as path from "path";
import * as http from "http";
import finalhandler from "finalhandler";
import serveStatic from "serve-static";

const staticFiles = serveStatic(path.join(__dirname, "./images/"));
const serverHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const done = finalhandler(req, res);
  return staticFiles(req as any, res as any, () => {
    done((err: unknown) => {
      if (err) throw err;
    });
  });
};

export const createSampleServer = () => http.createServer(serverHandler);
