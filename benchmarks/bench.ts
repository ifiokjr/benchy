import { parse } from "deno:flags";
import * as fs from "deno:fs";
import * as path from "deno:path";
import { objectEntries } from "ts-extras";
import { Command, RuntimeCommands } from "~/types.ts";
import { createSaveJsonFile, TEMP_URL } from "./utils.js";

const ENTRIES_URL = new URL("./entries/", import.meta.url);
const RUNTIMES_URL = new URL("./runtimes/", import.meta.url);
const save = createSaveJsonFile(Deno.writeTextFile, Deno.build.os);

const { exclude = [], only = [] } = parse(Deno.args, {
  collect: ["exclude", "only"],
});
const nodeRunner = path.join(RUNTIMES_URL.pathname, "node.js");
const bunRunner = path.join(RUNTIMES_URL.pathname, "bun.js");
const denoRunner = path.join(RUNTIMES_URL.pathname, "deno.js");

const runtimes: RuntimeCommands = {
  node: ["node", nodeRunner],
  bun: ["bun", "run", bunRunner],
  deno: ["deno", "run", "-A", "--unstable", denoRunner],
};

async function fileRunner(absolutePath: string) {
  const name = path.basename(absolutePath).replace(/\.js$/, "");
  for (const [_runtime, cmd] of objectEntries(runtimes)) {
    Deno.stdout.write(new TextEncoder().encode("."));
    await runBenchmark(cmd, absolutePath, name);
  }
}

async function runBenchmark(
  cmd: string[] | Command,
  absolutePath: string,
  name: string,
  json = "{}",
) {
  if (Array.isArray(cmd)) {
    const process = Deno.run({
      cmd: [
        ...cmd,
        "--file",
        absolutePath,
        "--name",
        name,
        "--json",
        json,
        "--os",
        Deno.build.os,
      ],
      stderr: "piped",
      stdout: "piped",
    });

    const [_output, error, status] = await Promise.all([
      process.output(),
      process.stderrOutput(),
      process.status(),
    ]);

    if (error.byteLength) {
      const errorLog = new TextDecoder().decode(error);

      if (!errorLog.includes("BenchyRunnerError")) {
        console.error(errorLog);
      }
    }

    return status.success;
  }

  await save(await cmd(Deno.build.os));
  return true;
}

async function folderRunner(absolutePath: string) {
  const name = path.basename(absolutePath);
  const setupPath = path.join(absolutePath, "setup.ts");
  let setup: (() => Promise<Record<string, unknown>>) | undefined;
  let teardown:
    | ((props: Record<string, unknown>) => Promise<Record<string, unknown>>)
    | undefined;
  let commands: RuntimeCommands | undefined;

  try {
    ({ setup, teardown, commands } = await import(setupPath));
  } catch {
    // No setup.ts file found.
  }

  const runner = path.join(absolutePath, "run.js");

  for (let [runtime, cmd] of objectEntries(runtimes)) {
    const runtimePath = path.join(absolutePath, `${runtime}.js`);
    cmd = commands?.[runtime] ?? cmd;
    const props = await setup?.();
    const json = props ? JSON.stringify(props) : "{}";

    Deno.stdout.write(new TextEncoder().encode("."));

    if (!await runBenchmark(cmd, runtimePath, name, json)) {
      await runBenchmark(cmd, runner, name, json);
    }

    await teardown?.(props ?? {});
  }
}

async function ensureDirectory() {
  await fs.ensureDir(path.join(TEMP_URL.pathname, Deno.build.os));
}

async function run() {
  for await (const entry of Deno.readDir(ENTRIES_URL)) {
    if (
      exclude.includes(entry.name) ||
      exclude.includes(entry.name.replace(/\.js$/, ""))
    ) {
      continue;
    }

    if (
      only.length > 0 &&
      !(only.includes(entry.name) ||
        only.includes(entry.name.replace(/\.js$/, "")))
    ) {
      continue;
    }

    const fullPath = new URL(entry.name, ENTRIES_URL.href).pathname;
    Deno.stdout.write(new TextEncoder().encode(`${entry.name} `));

    if (entry.isFile) {
      await fileRunner(fullPath);
    }

    if (entry.isDirectory) {
      await folderRunner(fullPath);
    }

    Deno.stdout.write(new TextEncoder().encode("\n"));
  }
}

await ensureDirectory();
await run();
