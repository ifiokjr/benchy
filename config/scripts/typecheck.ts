import { globber } from "globber";

export const cwd = new URL("../../", import.meta.url);

const files: string[] = [];
const entries = globber({
  cwd,
  include: ["benchmarks/*.ts", "main.ts", "config/*.ts"],
  exclude: ["**/fixtures", "**/snapshots", "node_modules/**"],
  excludeDirectories: true,
});

for await (const entry of entries) {
  files.push(entry.absolute);
}

const result = await Deno.run({
  cmd: ["deno", "--unstable", "check", ...files],
  stdout: "inherit",
  stdin: "inherit",
  stderr: "inherit",
}).status();

if (!result.success) {
  Deno.exit(result.code);
}
