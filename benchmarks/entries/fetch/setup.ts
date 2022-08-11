import { getFreePort } from "free_port";
import retry from "retry";

import { assert } from "../../utils.js";

const server = new URL("server.ts", import.meta.url).pathname;
const children: Record<number, Deno.Child> = {};

export interface Setup {
  port: number;
}

export async function setup(): Promise<Setup> {
  const port = await getFreePort(5115);
  const child = Deno.spawnChild(Deno.execPath(), {
    args: ["run", "-A", "--unstable", server, "--port", `${port}`],
  });

  children[port] = child;

  // Ensure the server is up and running.
  await retry(async () => {
    let text: string | undefined;

    try {
      const response = await fetch(`http://localhost:${port}/ping`);
      text = await response.text();
    } catch {
      // Ignore this error (for some reason it causes retry to fail)
    }

    assert(text === "pong");
  });

  return { port };
}

export function teardown(props: Setup) {
  const child = children[props.port];
  child?.kill("SIGTERM");
}
