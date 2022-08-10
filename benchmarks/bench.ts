import { parse } from "flags";
import { ensureDir } from "fs";
import { type Report } from "mitata";
import * as path from "path";
import { objectEntries } from "ts-extras";
import { Command, FullBenchmark, Runtime, RuntimeCommands } from "~/types.ts";

const ENTRIES_URL = new URL("./entries/", import.meta.url);
const RUNTIMES_URL = new URL("./runtimes/", import.meta.url);

const { exclude = [], only = [] } = parse(Deno.args, {
  collect: ["exclude", "only"],
});

const runtimes: RuntimeCommands = {
  node: ["node", path.join(RUNTIMES_URL.pathname, "node.js")],
  bun: ["bun", "run", path.join(RUNTIMES_URL.pathname, "bun.js")],
  deno: [
    "deno",
    "run",
    "-A",
    "--unstable",
    path.join(RUNTIMES_URL.pathname, "deno.js"),
  ],
};

async function fileRunner(absolutePath: string) {
  const name = path.basename(absolutePath).replace(/\.js$/, "");
  for (const [runtime, cmd] of objectEntries(runtimes)) {
    Deno.stdout.write(new TextEncoder().encode("."));
    await runBenchmark(cmd, absolutePath, name, runtime);
  }
}

async function runBenchmark(
  cmd: string[] | Command,
  absolutePath: string,
  name: string,
  runtime: Runtime,
  json = "{}",
) {
  let outputString: string | undefined;

  if (Array.isArray(cmd)) {
    const process = Deno.run({
      cmd: [...cmd, "--file", absolutePath, "--name", name, "--json", json],
      stdout: "piped",
    });

    const output = await process.output();
    // const outputString = new TextDecoder().decode(output).split("\n").at(-2) ?? "";
    outputString = new TextDecoder()
      .decode(output)
      .split("\n")
      .find((line) => line.startsWith('{"benchmarks":'));
  } else {
    outputString = await cmd();
  }

  if (!outputString) {
    return false;
  }

  try {
    const report: Report = JSON.parse(outputString);
    updateFullBenchmark(report, runtime);
    return true;
  } catch {
    return false;
  }
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
    await runBenchmark(cmd, runtimePath, name, runtime, json) ||
      await runBenchmark(cmd, runner, name, runtime, json);

    await teardown?.(props ?? {});
  }
}

async function loadJsonFile(filepath: string | URL, fallback: unknown = null) {
  try {
    return JSON.parse(await Deno.readTextFile(filepath));
  } catch {
    return fallback;
  }
}

function updateFullBenchmark(report: Report, runtime: keyof typeof runtimes) {
  if (!fullBenchmark.cpu) {
    fullBenchmark.cpu = report.cpu;
  }

  if (!fullBenchmark.arch && runtime === "deno") {
    const [, , arch = ""] = report.runtime.split(" ");
    fullBenchmark.arch = arch.replace(/\(|\)/g, "");
  }

  if (!fullBenchmark.versions[runtime]) {
    const [value, version = ""] = report.runtime.split(" ");

    if (value === runtime) {
      // Some benchmarks are run within deno commands.
      fullBenchmark.versions[runtime] = version.replace(/^v/, "");
    }
  }

  for (const benchmark of report.benchmarks) {
    if (!benchmark.stats) {
      continue;
    }

    const { name, time, stats } = benchmark;
    const { jit: _, ...rest } = stats;

    if (!fullBenchmark.entries[name]) {
      fullBenchmark.entries[name] = [];
    }

    fullBenchmark.entries[name].push({ ...rest, name, time, runtime });
  }
}

const FILENAME = `${Date.now()}.json`;

async function saveBenchmark() {
  const outputFile = new URL(
    `../static/runtime/${FILENAME}`,
    import.meta.url,
  );

  await ensureDir(path.dirname(outputFile.pathname));
  await Deno.writeTextFile(outputFile, JSON.stringify(fullBenchmark));
}

async function updateEntries() {
  const entriesFile = new URL(
    `../static/runtime/entries.json`,
    import.meta.url,
  );

  const entries: string[] = await loadJsonFile(entriesFile, []);
  entries.push(FILENAME);
  await Deno.writeTextFile(entriesFile, JSON.stringify(entries));
}

const fullBenchmark: FullBenchmark = {
  cpu: "",
  arch: "",
  versions: {
    deno: "",
    bun: "",
    node: "",
  },
  entries: {},
};

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

await saveBenchmark();
await updateEntries();
