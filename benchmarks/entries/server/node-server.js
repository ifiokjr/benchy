import http from "node:http";
import { parseArgs } from "node:util";

const options = { port: { type: "string" } };
const { values: { port } } = parseArgs({ options });

http
  .Server((req, res) => {
    const url = new URL(req.url);

    if (url.pathname === "/json") {
      res.end(JSON.stringify({ message: "Hello, World!" }));
    } else if (url.pathname === "/promise") {
      Promise.resolve("As promised!").then((body) => res.end(body));
    } else {
      res.end("Hello, World!");
    }
  })
  .listen(Number(port));
