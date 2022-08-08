import { bench, group, run } from "mitata";

export async function load(file, name) {
  const { default: main, setup, teardown, ...rest } = await import(file);

  await setup?.();

  if (main) {
    bench(name, main);
  }

  if (Object.keys(rest).length > 0) {
    group(name, () => {
      for (const [key, fn] of Object.entries(rest)) {
        bench(`${name}:${key}`, fn);
      }
    });
  }

  await run({ json: true });
  await teardown?.();
}
