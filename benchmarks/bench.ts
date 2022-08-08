import { ensureDir } from "fs";
import { bench, type Report, run } from "mitata";
import * as path from "path";
import { objectEntries } from "ts-extras";
import { BenchmarkEntry, FullBenchmark } from "~/types.ts";

const FIXTURES = new URL("./fixtures/", import.meta.url);
const RUNTIMES = new URL("./runtimes/", import.meta.url);

const runtimes = {
  node: ["node", path.join(RUNTIMES.pathname, "node.js")],
  bun: ["bun", "run", path.join(RUNTIMES.pathname, "bun.js")],
  deno: [
    "deno",
    "run",
    "-A",
    "--unstable",
    path.join(RUNTIMES.pathname, "deno.js"),
  ],
};

async function fileRunner(absolutePath: string) {
  const name = path.basename(absolutePath).replace(/\.js$/, "");
  for (const [runtime, cmd] of objectEntries(runtimes)) {
    Deno.stdout.write(new TextEncoder().encode("."));
    const process = Deno.run({
      cmd: [...cmd, "--file", absolutePath, "--name", name],
      stdout: "piped",
    });

    const output = await process.output();
    const outputString = new TextDecoder().decode(output).split("\n").at(-2) ??
      "";
    // if (outputString.includes("hello")) {
    //   console.log(outputString);
    // }
    try {
      const report: Report = JSON.parse(outputString);
      updateFullBenchmark(report, runtime);
    } catch {
      // store something here
    }
  }
}

async function folderRunner(absolutePath: string) {
  const name = path.basename(absolutePath);
  const config = await loadJsonFile(
    path.join(absolutePath, "config.ts"),
  );
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
    const [_, version = ""] = report.runtime.split(" ");
    fullBenchmark.versions[runtime] = version.replace(/^v/, "");
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

for await (const entry of Deno.readDir(FIXTURES)) {
  const fullPath = new URL(entry.name, FIXTURES.href).pathname;

  if (!entry.isFile && !entry.isDirectory) {
    continue;
  }

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
