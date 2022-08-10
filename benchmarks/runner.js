import { bench, group, run } from "mitata";

export async function load(file, name, json = "{}") {
  let imports;

  try {
    imports = await import(file);
  } catch (_error) {
    return;
  }

  const { default: main, setup, teardown, ...rest } = imports;
  const props = JSON.parse(json);
  await setup?.();

  if (main) {
    bench(name, () => main(props));
  }

  if (Object.keys(rest).length > 0) {
    group(name, () => {
      for (const [key, fn] of Object.entries(rest)) {
        bench(`${name}:${key}`, () => fn(props));
      }
    });
  }

  await run({ json: true });
  await teardown?.();
}
