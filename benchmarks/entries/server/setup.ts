import { getFreePort } from "free_port";
import { Report } from "mitata";
import type {
  AutoCannon,
  Command,
  Entry,
  Runtime,
  RuntimeCommands,
} from "~/types.ts";
import { mapAutoCannonToEntry } from "../../utils.js";

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

function createCommand(command: Runtime, args: string[]): Command {
  return async () => {
    const port = await getFreePort(5125);
    const entries: Entry[] = [];

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

      updateEntries(entries, json, command, "server:text");
    }

    {
      const jsonChild = Deno.spawnChild("pnpm", {
        args: ["autocannon", `http://localhost:${port}/json`, "--json"],
      });

      const output = await jsonChild.output();
      const outputString = new TextDecoder().decode(output.stdout);
      const json: AutoCannon = JSON.parse(outputString);

      updateEntries(entries, json, command, "server:json");
    }

    {
      const promiseChild = Deno.spawnChild("pnpm", {
        args: ["autocannon", `http://localhost:${port}/promise`, "--json"],
      });

      const output = await promiseChild.output();
      const outputString = new TextDecoder().decode(output.stdout);
      const json: AutoCannon = JSON.parse(outputString);

      updateEntries(entries, json, command, "server:promise");
    }

    try {
      serverChild.kill("SIGTERM");
    } catch {
      console.error("this broke");
      // Sometimes this breaks;
    }

    return entries;
  };
}

function updateEntries(
  entries: Entry[],
  json: AutoCannon,
  runtime: Runtime,
  name: string,
) {
  entries.push(...mapAutoCannonToEntry(json, runtime, name));
}
