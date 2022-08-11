import { parse } from "deno:flags";
import { serve } from "http/server";

const { port } = parse(Deno.args, { string: ["port"] });

const handler = (request: Request): Response => {
  const pathname = new URL(request.url).pathname;
  const headers = new Headers();

  if (pathname === "/json") {
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ success: true }), {
      headers,
      status: 200,
    });
  }

  if (pathname === "/text") {
    headers.set("Content-Type", "text/plain");
    return new Response("This is text", { headers, status: 200 });
  }

  if (pathname === "/form") {
    const data = new FormData();
    data.set("success", "true");
    headers.set("Content-Type", "application/x-www-form-urlencoded");
    return new Response(data, { headers, status: 200 });
  }

  if (pathname === "/ping") {
    headers.set("Content-Type", "text/plain");
    return new Response("pong", { status: 200 });
  }

  return new Response("", { status: 500 });
};

await serve(handler, { port: Number(port) });
