let extension = "";
switch (Deno.build.os) {
  case "windows":
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

const { symbols: { noop: noopFfi, hash: hashFfi, add: addFfi } } = Deno.dlopen(
  path,
  {
    noop: { parameters: [], result: "void" },
    add: { parameters: ["u32", "u32"], result: "u32" },
    hash: { parameters: ["pointer", "u32"], result: "u32" },
  },
);

export function noop() {
  return noopFfi();
}

export function hash() {
  const bytes = new Uint8Array(64);
  return hashFfi(bytes, bytes.byteLength);
}

export function add() {
  return addFfi(10, 20);
}
