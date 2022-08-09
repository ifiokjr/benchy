import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { noop: noopNapi, hash: hashNapi, add: addNapi } = require(
  "../../benchmark_rust.node",
);

export function noop() {
  return noopNapi();
}

export function hash() {
  const bytes = new Uint8Array(64);
  return hashNapi(bytes, bytes.byteLength);
}

export function add() {
  return addNapi(10, 20);
}
