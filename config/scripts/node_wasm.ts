const cwd = new URL("../../benchmarks/wasm/", import.meta.url);
const sourceUrl = new URL("benchmark_rust.js", cwd);
const targetUrl = new URL("benchmark_rust_node.js", cwd);

await Deno.copyFile(sourceUrl, targetUrl);

const contents = await Deno.readTextFile(targetUrl);
const updated = `import fs from "node:fs/promises";\n${
  contents.replace("Deno.readFile", "fs.readFile")
}`;

await Deno.writeTextFile(targetUrl, updated);
