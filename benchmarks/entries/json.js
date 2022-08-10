const smallJson = { "hello": "world" };
const smallJsonString = '{"hello": "world"}';
const bigJson = {};

for (const [index] of Array.from({ length: 1024 }).entries()) {
  bigJson[index] = [];

  for (const [index2] of Array.from({ length: 1024 }).entries()) {
    bigJson[index].push(index2 + index);
  }
}

const bigJsonString = JSON.stringify({ ...bigJson, nested: { ...bigJson } });

export function stringifyBig() {
  return JSON.stringify(bigJson);
}

export function stringifySmall() {
  return JSON.stringify(smallJson);
}

export function parseSmall() {
  return JSON.parse(smallJsonString);
}

export function parseBig() {
  return JSON.parse(bigJsonString);
}
