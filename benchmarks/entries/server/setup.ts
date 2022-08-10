import { getFreePort } from "free_port";
import { Report } from "mitata";
import { AutoCannon, Command, RuntimeCommands } from "~/types.ts";

export const commands: RuntimeCommands = {
  bun: createCommand("bun", [
    new URL("bun-server.js", import.meta.url).pathname,
  ]),
  node: createCommand("node", [
    new URL("node-server.js", import.meta.url).pathname,
  ]),
  deno: createCommand("deno", [
    "run",
    "-A",
    "--unstable",
    new URL("deno-server.js", import.meta.url).pathname,
  ]),
};

function createCommand(command: string, args: string[]): Command {
  return async () => {
    const port = await getFreePort(5125);
    const report: Report = { benchmarks: [], cpu: "", runtime: "" };

    // spawn the server
    const serverChild = Deno.spawnChild(command, {
      args: [...args, "--port", `${port}`],
    });

    {
      const textChild = Deno.spawnChild("pnpm", {
        args: ["autocannon", `http://localhost:${port}`, "--json"],
      });

      const output = await textChild.output();
      const outputString = new TextDecoder().decode(output.stdout);
      const json: AutoCannon = JSON.parse(outputString);

      insertAsBenchmark(report, json, "server:text");
    }

    // {
    //   const jsonChild = Deno.spawnChild("pnpm", {
    //     args: ["autocannon", `http://localhost:${port}/json`, "--json"],
    //   });

    //   const output = await jsonChild.output();
    //   const outputString = new TextDecoder().decode(output.stdout);
    //   const json: AutoCannon = JSON.parse(outputString);

    //   insertAsBenchmark(report, json, "server:json");
    // }

    // {
    //   const promiseChild = Deno.spawnChild("pnpm", {
    //     args: ["autocannon", `http://localhost:${port}/promise`, "--json"],
    //   });

    //   const output = await promiseChild.output();
    //   const outputString = new TextDecoder().decode(output.stdout);
    //   const json: AutoCannon = JSON.parse(outputString);

    //   insertAsBenchmark(report, json, "server:promise");
    // }

    try {
      serverChild.kill("SIGTERM");
    } catch {
      // Sometimes this breaks;
    }

    return JSON.stringify(report);
  };
}

function insertAsBenchmark(report: Report, json: AutoCannon, name: string) {
  report.benchmarks.push({
    async: true,
    baseline: false,
    fn: () => {},
    group: "server",
    name,
    time: json.duration * 1000,
    warmup: true,
    stats: {
      avg: json.latency.average,
      jit: [],
      max: json.latency.max,
      min: json.latency.min,
      n: json.latency.totalCount,
      p75: json.latency.p75,
      p99: json.latency.p99,
      p995: json.latency.p99_9,
      p999: json.latency.p99_999,
    },
  });
}
