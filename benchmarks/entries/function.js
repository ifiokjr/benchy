export async function asyncNoop() {}

export async function asyncResolved() {
  await Promise.resolve(1);
}

export async function asyncPromise() {
  await sleep();
}

export async function asyncValue() {
  await 1;
}

export function noop() {}

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1));
}
