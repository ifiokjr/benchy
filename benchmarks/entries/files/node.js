import {
  copyFileSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import {
  copyFile,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import * as path from "node:path";

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readKb(props) {
  await readFile(props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readMb(props) {
  await readFile(props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readGb(props) {
  await readFile(props.read.gb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readKbSync(props) {
  readFileSync(props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readMbSync(props) {
  readFileSync(props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readGbSync(props) {
  readFileSync(props.read.gb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function writeKb(props) {
  await writeFile(path.join(props.root, "kb_write"), new Uint8Array(1024));
  await rm(path.join(props.root, "kb_write"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function writeMb(props) {
  await writeFile(
    path.join(props.root, "mb_write"),
    new Uint8Array(1024 * 1024),
  );
  await rm(path.join(props.root, "mb_write"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function writeGb(props) {
  await writeFile(
    path.join(props.root, "gb_write"),
    new Uint8Array(1024 * 1024 * 1024),
  );
  await rm(path.join(props.root, "gb_write"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function writeKbSync(props) {
  writeFileSync(
    path.join(props.root, "kb_write_sync"),
    new Uint8Array(1024),
  );
  rmSync(path.join(props.root, "kb_write_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function writeMbSync(props) {
  writeFileSync(
    path.join(props.root, "mb_write_sync"),
    new Uint8Array(1024 * 1024),
  );
  rmSync(path.join(props.root, "mb_write_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function writeGbSync(props) {
  writeFileSync(
    path.join(props.root, "gb_write_sync"),
    new Uint8Array(1024 * 1024 * 1024),
  );
  rmSync(path.join(props.root, "gb_write_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function readDir(props) {
  return await readdir(props.readdir);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function readDirSync(props) {
  return readdirSync(props.readdir);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function copyKb(props) {
  await copyFile(props.read.kb, path.join(props.root, "kb_copy"));
  await rm(path.join(props.root, "kb_copy"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function copyMb(props) {
  await copyFile(props.read.mb, path.join(props.root, "mb_copy"));
  await rm(path.join(props.root, "mb_copy"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function copyGb(props) {
  await copyFile(props.read.gb, path.join(props.root, "gb_copy"));
  await rm(path.join(props.root, "gb_copy"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function copyKbSync(props) {
  copyFileSync(props.read.kb, path.join(props.root, "kb_copy_sync"));
  rmSync(path.join(props.root, "kb_copy_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function copyMbSync(props) {
  copyFileSync(props.read.mb, path.join(props.root, "mb_copy_sync"));
  rmSync(path.join(props.root, "mb_copy_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function copyGbSync(props) {
  copyFileSync(props.read.gb, path.join(props.root, "gb_copy_sync"));
  rmSync(path.join(props.root, "gb_copy_sync"));
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function renameKb(props) {
  await rename(props.read.kb, path.join(props.root, "kb_rename"));
  await rename(path.join(props.root, "kb_rename"), props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function renameMb(props) {
  await rename(props.read.mb, path.join(props.root, "mb_rename"));
  await rename(path.join(props.root, "mb_rename"), props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export async function renameGb(props) {
  await rename(props.read.gb, path.join(props.root, "gb_rename"));
  await rename(path.join(props.root, "gb_rename"), props.read.gb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function renameKbSync(props) {
  renameSync(props.read.kb, path.join(props.root, "kb_rename_sync"));
  renameSync(path.join(props.root, "kb_rename_sync"), props.read.kb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function renameMbSync(props) {
  renameSync(props.read.mb, path.join(props.root, "mb_rename_sync"));
  renameSync(path.join(props.root, "mb_rename_sync"), props.read.mb);
}

/**
 * @param {import('./setup.ts').Setup} props
 */
export function renameGbSync(props) {
  renameSync(props.read.gb, path.join(props.root, "gb_rename_sync"));
  renameSync(path.join(props.root, "gb_rename_sync"), props.read.gb);
}
