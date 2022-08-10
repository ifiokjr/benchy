export function create() {
  const set = new Set(data);
  set.add("value");
  return set;
}

export function has() {
  return set.has("501");
}

export function clear() {
  const set = new Set(data);
  set.clear();
}

const data = Array.from({ length: 1000 }).map((_, i) => `${i}`);
const set = new Set(data);
