import { globber } from "https://deno.land/x/globber@0.1.0/mod.ts";

const cwd = new URL("../benchmarks/napi/");
const iterator = globber({ cwd, maxDepth: 1, extensions: [".node"] });

for await (const entry of iterator) {
  await Deno.rename(entry.absolute, new URL("benchmark_rust.node", cwd));
}
