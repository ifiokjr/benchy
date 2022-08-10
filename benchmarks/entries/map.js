export function create() {
  const map = new Map(data);
  map.set("key", "value");
  return map;
}

export function has() {
  return map.has("501");
}

export function get() {
  return map.get("500");
}

export function clear() {
  const map = new Map(data);
  map.clear();
}

const data = Array.from({ length: 1000 }).map((_, i) => [`${i}`, i]);
const map = new Map(data);
