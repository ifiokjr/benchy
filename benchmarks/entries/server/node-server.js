import http from "node:http";
import { parseArgs } from "node:util";

const options = { port: { type: "string" } };
const { values: { port } } = parseArgs({ options });

http
  .Server((req, res) => {
    if (req.url === "/json") {
      res.end(JSON.stringify({ message: "Hello, World!" }));
    } else if (req.url === "/promise") {
      Promise.resolve("As promised!").then((body) => res.end(body));
    } else {
      res.end("Hello, World!");
    }
  })
  .listen(Number(port));
