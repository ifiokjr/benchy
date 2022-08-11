import * as path from "deno:path";

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readKb(props) {
  await Deno.readFile(props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readMb(props) {
  await Deno.readFile(props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readGb(props) {
  await Deno.readFile(props.read.gb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readKbSync(props) {
  Deno.readFileSync(props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readMbSync(props) {
  Deno.readFileSync(props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readGbSync(props) {
  Deno.readFileSync(props.read.gb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function writeKb(props) {
  await Deno.writeFile(path.join(props.root, "kb_write"), new Uint8Array(1024));
  await Deno.remove(path.join(props.root, "kb_write"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function writeMb(props) {
  await Deno.writeFile(
    path.join(props.root, "mb_write"),
    new Uint8Array(1024 * 1024),
  );
  await Deno.remove(path.join(props.root, "mb_write"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function writeGb(props) {
  await Deno.writeFile(
    path.join(props.root, "gb_write"),
    new Uint8Array(1024 * 1024 * 1024),
  );
  await Deno.remove(path.join(props.root, "gb_write"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function writeKbSync(props) {
  Deno.writeFileSync(
    path.join(props.root, "kb_write_sync"),
    new Uint8Array(1024),
  );
  Deno.removeSync(path.join(props.root, "kb_write_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function writeMbSync(props) {
  Deno.writeFileSync(
    path.join(props.root, "mb_write_sync"),
    new Uint8Array(1024 * 1024),
  );
  Deno.removeSync(path.join(props.root, "mb_write_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function writeGbSync(props) {
  Deno.writeFileSync(
    path.join(props.root, "gb_write_sync"),
    new Uint8Array(1024 * 1024 * 1024),
  );
  Deno.removeSync(path.join(props.root, "gb_write_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readDir(props) {
  const entries = [];

  for await (const entry of Deno.readDir(props.readdir)) {
    entries.push(entry.name);
  }

  return entries;
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readDirSync(props) {
  return [...Deno.readDirSync(props.readdir)];
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function copyKb(props) {
  await Deno.copyFile(props.read.kb, path.join(props.root, "kb_copy"));
  await Deno.remove(path.join(props.root, "kb_copy"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function copyMb(props) {
  await Deno.copyFile(props.read.mb, path.join(props.root, "mb_copy"));
  await Deno.remove(path.join(props.root, "mb_copy"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function copyGb(props) {
  await Deno.copyFile(props.read.gb, path.join(props.root, "gb_copy"));
  await Deno.remove(path.join(props.root, "gb_copy"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function copyKbSync(props) {
  Deno.copyFileSync(props.read.kb, path.join(props.root, "kb_copy_sync"));
  Deno.removeSync(path.join(props.root, "kb_copy_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function copyMbSync(props) {
  Deno.copyFileSync(props.read.mb, path.join(props.root, "mb_copy_sync"));
  Deno.removeSync(path.join(props.root, "mb_copy_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function copyGbSync(props) {
  Deno.copyFileSync(props.read.gb, path.join(props.root, "gb_copy_sync"));
  Deno.removeSync(path.join(props.root, "gb_copy_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function renameKb(props) {
  await Deno.rename(props.read.kb, path.join(props.root, "kb_rename"));
  await Deno.rename(path.join(props.root, "kb_rename"), props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function renameMb(props) {
  await Deno.rename(props.read.mb, path.join(props.root, "mb_rename"));
  await Deno.rename(path.join(props.root, "mb_rename"), props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function renameGb(props) {
  await Deno.rename(props.read.gb, path.join(props.root, "gb_rename"));
  await Deno.rename(path.join(props.root, "gb_rename"), props.read.gb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function renameKbSync(props) {
  Deno.renameSync(props.read.kb, path.join(props.root, "kb_rename_sync"));
  Deno.renameSync(path.join(props.root, "kb_rename_sync"), props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function renameMbSync(props) {
  Deno.renameSync(props.read.mb, path.join(props.root, "mb_rename_sync"));
  Deno.renameSync(path.join(props.root, "mb_rename_sync"), props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function renameGbSync(props) {
  Deno.renameSync(props.read.gb, path.join(props.root, "gb_rename_sync"));
  Deno.renameSync(path.join(props.root, "gb_rename_sync"), props.read.gb);
}
