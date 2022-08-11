import { randomBytes } from "node:crypto";
import path from "node:path";

class AssertionError extends Error {
  name = "AssertionError";
  constructor(message) {
    super(message);
  }
}

/**
 * @param {unknown} value
 * @returns {asserts value}
 */
export function assert(value) {
  if (!value) {
    throw new AssertionError(`The value provided: '${value}' is not truthy.`);
  }
}

/**
 * @param {import('mitata').Report} report
 * @param {import('~/types.ts').Runtime} runtime
 * @returns {import('~/types.ts').TimePerIterationEntry[]}
 */
export function mapReportToEntry(report, runtime) {
  const same = { runtime, type: "timePerIteration", sorting: -1 };

  return report.benchmarks.map((benchmark) => {
    const { name, stats, time } = benchmark;
    const { jit: _, ...rest } = stats ?? {};

    return { ...same, name, time, ...rest };
  });
}

/**
 * @param {import('~/types.ts').AutoCannon} autocannon
 * @param {import('~/types.ts').Runtime} runtime
 * @param {string} name
 * @returns {import('~/types.ts').ThroughputEntry[]}
 */
export function mapAutoCannonToEntry(autocannon, runtime, name) {
  return [{
    runtime,
    name: `${name}:throughput`,
    type: "throughput",
    sorting: 1,
    time: autocannon.duration,
    ...autocannon.throughput,
  }, {
    runtime,
    name: `${name}:latency`,
    type: "latency",
    sorting: -1,
    time: autocannon.duration,
    ...autocannon.latency,
  }, {
    runtime,
    name: `${name}:requests`,
    type: "requests",
    sorting: 1,
    time: autocannon.duration,
    ...autocannon.requests,
  }];
}

export const TEMP_URL = new URL("../tmp/", import.meta.url);

/**
 * @param {typeof Deno.writeTextFile} writeFile
 * @param {typeof Deno.build.os} os
 */
export function createSaveJsonFile(writeFile, os) {
  return async (json) => {
    const filename = `${randomBytes(18).toString("hex")}.json`;
    const outputPath = path.join(TEMP_URL.pathname, os, filename);
    const jsonString = JSON.stringify(json);

    await writeFile(outputPath, jsonString);
  };
}
