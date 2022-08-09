import {
  add as addWasm,
  hash as hashWasm,
  noop as noopWasm,
} from "../../wasm/benchmark_rust_node.js";

export function noop() {
  return noopWasm();
}

export function hash() {
  const bytes = new Uint8Array(64);
  return hashWasm(bytes, bytes.byteLength);
}

export function add() {
  return addWasm(10, 20);
}
