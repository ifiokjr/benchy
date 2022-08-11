import { bench, group, run } from "mitata";
import { mapReportToEntry } from "./utils.js";

class BenchyRunnerError extends Error {
  name = "RunnerError";
  constructor(message) {
    super(message);
  }
}

/**
 * @param {typeof Deno.writeTextFile} save
 * @param {import('~/types.ts').Runtime} runtime
 * @param {string} file
 * @param {string} name
 * @param {string} json
 */
export async function load(save, runtime, file, name, json = "{}") {
  let imports;

  try {
    imports = await import(file);
  } catch (_error) {
    throw new BenchyRunnerError("Failed to import file.");
  }

  const { default: main, setup, teardown, ...rest } = imports;
  const props = JSON.parse(json);
  await setup?.();

  if (main) {
    bench(name, () => main(props));
  }

  if (Object.keys(rest).length > 0) {
    group(name, () => {
      for (const [key, fn] of Object.entries(rest)) {
        bench(`${name}:${key}`, () => fn(props));
      }
    });
  }

  const report = await run({ json: true });
  const mappedReport = mapReportToEntry(report, runtime);
  await save(mappedReport);

  await teardown?.();
}
