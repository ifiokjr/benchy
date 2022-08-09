import { bench, group, run } from "mitata";

export async function load(file, name) {
  let imports;

  try {
    imports = await import(file);
  } catch {
    return;
  }

  const { default: main, setup, teardown, ...rest } = imports;

  await setup?.();

  if (main) {
    bench(name, main);
  }

  if (Object.keys(rest).length > 0) {
    group(() => {
      for (const [key, fn] of Object.entries(rest)) {
        bench(`${name}:${key}`, fn);
      }
    });
  }

  await run({ json: true });
  await teardown?.();
}
