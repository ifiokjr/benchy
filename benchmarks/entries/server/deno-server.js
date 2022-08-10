import { parse } from "flags";

const { port } = parse(Deno.args, {
  string: ["port"],
});

for await (const conn of Deno.listen({ port: Number(port) })) {
  (async () => {
    for await (const { respondWith, request } of Deno.serveHttp(conn)) {
      const url = new URL(request.url);

      if (url.pathname === "/json") {
        respondWith(Response(JSON.stringify({ message: "Hello, World!" })));
      } else if (url.pathname === "/promise") {
        respondWith(Promise.resolve(new Response("As promised!")));
      } else {
        respondWith(new Response("Hello, World!"));
      }
    }
  })();
}
