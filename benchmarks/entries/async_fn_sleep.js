function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1));
}

export default async function () {
  await sleep();
}
