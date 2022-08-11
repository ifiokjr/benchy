/**
 * Gather all the benchmarks together and save them as os specific files.
 */

import { ensureDir } from "deno:fs";
import * as path from "deno:path";
import { arrayIncludes } from "ts-extras";
import { Entry, FullBenchmark, Os, Timestamps } from "~/types.ts";
import { getVersions } from "./get-versions.ts";
import { TEMP_URL } from "./utils.js";

const TIMESTAMP = Date.now();
const STATIC_RUNTIME_FOLDER = new URL("../static/runtime/", import.meta.url);
const TIMESTAMPS = new URL("timestamps.json", STATIC_RUNTIME_FOLDER);
const BENCHMARK_FOLDER = new URL(`${TIMESTAMP}/`, STATIC_RUNTIME_FOLDER);

async function updateTimestamps(osList: IterableIterator<Os>) {
  const timestamps: Timestamps = await loadJsonFile(TIMESTAMPS, {});

  timestamps[TIMESTAMP] = {};

  for (const os of osList) {
    timestamps[TIMESTAMP][os] = `/runtime/${TIMESTAMP}/${os}.json`;
  }

  await Deno.writeTextFile(TIMESTAMPS, JSON.stringify(timestamps));
}

async function loadJsonFile(filepath: string | URL, fallback: unknown = null) {
  try {
    return JSON.parse(await Deno.readTextFile(filepath));
  } catch {
    return fallback;
  }
}

type BenchmarkMap = Map<Os, FullBenchmark>;

async function saveBenchmarks(benchmarks: BenchmarkMap) {
  const promises: Array<Promise<void>> = [];
  await ensureDir(BENCHMARK_FOLDER.pathname);

  for (const [os, benchmark] of benchmarks) {
    const destination = new URL(`${os}.json`, BENCHMARK_FOLDER);
    promises.push(Deno.writeTextFile(destination, JSON.stringify(benchmark)));
  }

  await Promise.all(promises);
}

async function run() {
  await ensureDir(STATIC_RUNTIME_FOLDER.pathname);
  const versions = await getVersions();
  const benchmarks: BenchmarkMap = new Map();

  for await (const osEntry of Deno.readDir(TEMP_URL)) {
    if (!osEntry.isDirectory || !isBuildOs(osEntry.name)) {
      continue;
    }

    const fullPath = path.join(TEMP_URL.pathname, osEntry.name);
    const os = osEntry.name;
    const benchmark: FullBenchmark = { os, versions, entries: {} };

    for await (const fileEntry of Deno.readDir(fullPath)) {
      const absoluteJsonFile = path.join(fullPath, fileEntry.name);
      const entries: Entry[] = await loadJsonFile(absoluteJsonFile, []);

      for (const entry of entries) {
        benchmark.entries[entry.name] ??= [];
        benchmark.entries[entry.name].push(entry);
      }
    }

    benchmarks.set(os, benchmark);
  }

  await saveBenchmarks(benchmarks);
  await updateTimestamps(benchmarks.keys());
}

function isBuildOs(value: string): value is Os {
  return arrayIncludes(["darwin", "linux", "windows"], value);
}

await run();
