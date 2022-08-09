import { dlopen, ptr } from "bun:ffi";

let extension = "";
switch (process.platform) {
  case "win32":
    extension = ".dll";
    break;
  case "darwin":
    extension = ".dylib";
    break;
  default:
    extension = ".so";
    break;
}

const path = new URL(
  "../../../target/release/libbenchmark_rust" + extension,
  import.meta.url,
).pathname;

const {
  symbols: {
    noop: { native: noopFfi },
    hash: { native: hashFfi },
    add: { native: addFfi },
  },
} = dlopen(path, {
  noop: { args: [], returns: "void" },
  add: { args: ["u32", "u32"], returns: "u32" },
  hash: { args: ["ptr", "u32"], returns: "u32" },
});

export function noop() {
  noopFfi();
}

export function add() {
  addFfi(10, 20);
}

export function hash() {
  const bytes = new Uint8Array(64);
  hashFfi(ptr(bytes), bytes.byteLength);
}
