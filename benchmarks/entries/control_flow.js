// deno-lint-ignore-file prefer-const
let item = 0;
let otherItem = 1 > 0;

function _if() {
  let value = 0;

  if (item) {
    value++;
  }

  if (otherItem) {
    value += 10;
  }

  if (Math.random() > 0.5) {
    value++;
  }

  return value;
}

function _for() {
  let value = 0;

  for (let i = 0; i < 1000; i++) {
    value++;
  }

  return value;
}

export function forOfEntries() {
  let value = 0;

  for (const [increment] of Array.from({ length: 1000 }).entries()) {
    value += increment;
  }

  return value;
}

export { _for as for, _if as if };
