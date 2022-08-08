import { parse } from "https://deno.land/std@0.151.0/flags/mod.ts";
import { load } from "../runner.js";

const { name, file } = parse(Deno.args, { string: ["name", "file"] });

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(file, name);
