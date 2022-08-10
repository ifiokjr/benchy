import mri from "mri";

const { port } = mri(Bun.argv, {
  string: ["port"],
});

export default {
  port: Number(port),
  fetch: (request) => {
    const url = new URL(request.url);

    if (url.pathname === "/json") {
      return new Response(JSON.stringify({ message: "Hello, World!" }));
    }

    if (url.pathname === "/promise") {
      return Promise.resolve(new Response("As promised!"));
    }

    return new Response("Hello, World!");
  },
};
