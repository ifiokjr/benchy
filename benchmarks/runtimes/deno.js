import { parse } from "deno:flags";
import { load } from "../runner.js";
import { createSaveJsonFile } from "../utils.js";

const { name, file, json, os } = parse(Deno.args, {
  string: ["name", "file", "json", "os"],
});
const save = createSaveJsonFile(Deno.writeTextFile, os);

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(save, "deno", file, name, json);
