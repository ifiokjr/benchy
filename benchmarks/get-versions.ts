import { Runtime } from "~/types.ts";

type Versions = Record<Runtime, string>;

export async function getVersions(): Promise<Versions> {
  const [deno, node, bun] = await Promise.all([
    getDenoVersion(),
    getBunVersion(),
    getNodeVersion(),
  ]);

  return { deno, bun, node };
}

const decoder = new TextDecoder();

function decode(value: Uint8Array): string {
  return decoder.decode(value);
}

async function getBunVersion(): Promise<string> {
  const output = await Deno.run({
    cmd: ["bun", "--version"],
    stdout: "piped",
  }).output();
  const outputString = decode(output);

  return outputString.trim();
}

async function getNodeVersion(): Promise<string> {
  const output = await Deno.run({
    cmd: ["node", "--version"],
    stdout: "piped",
  }).output();
  const outputString = decode(output);

  return outputString.replace("v", "").trim();
}

async function getDenoVersion(): Promise<string> {
  const output = await Deno.run({
    cmd: ["deno", "-V"],
    stdout: "piped",
  }).output();
  const outputString = decode(output);
  const [, version = ""] = outputString.split(" ");

  return version.trim();
}
