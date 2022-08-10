import { ensureDir } from "fs";
import * as path from "path";
import { objectEntries } from "ts-extras";

export interface Setup {
  root: string;
  read: Record<keyof typeof SIZES, string>;
  readdir: string;
}

export async function setup(): Promise<Setup> {
  const root = await Deno.makeTempDir();
  const readRoot = path.join(root, "read");
  const read = {
    kb: path.join(readRoot, "kb"),
    mb: path.join(readRoot, "mb"),
    gb: path.join(readRoot, "gb"),
  };

  const readdir = path.join(root, "readdir");
  const readPromises: Array<Promise<void>> = [];
  const readdirPromises: Array<Promise<void>> = [];

  await Promise.all([ensureDir(readRoot), ensureDir(readdir)]);

  for (const [file, size] of objectEntries(SIZES)) {
    readPromises.push(Deno.writeFile(read[file], new Uint8Array(size)));
  }

  for (const [index] of Array.from({ length: 1000 }).entries()) {
    readdirPromises.push(
      Deno.writeTextFile(path.join(readdir, `${index}`), `${index}`),
    );
  }

  await Promise.all([...readPromises, readdirPromises]);

  const props = { root, read, readdir };
  return props;
}

export async function teardown(props: Setup) {
  await Deno.remove(props.root, { recursive: true });
}

const SIZES = {
  kb: 1024,
  mb: 1024 * 1024,
  gb: 1024 * 1024 * 1024,
};
