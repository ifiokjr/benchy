import { parse } from "flags";
import { load } from "../runner.js";

const { name, file, json } = parse(Deno.args, {
  string: ["name", "file", "json"],
});

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(file, name, json);
