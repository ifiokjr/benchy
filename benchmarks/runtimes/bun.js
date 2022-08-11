import mri from "mri";
import { writeFile } from "node:fs/promises";
import { load } from "../runner.js";
import { createSaveJsonFile } from "../utils.js";

const { name, file, json, os } = mri(Bun.argv, {
  string: ["name", "file", "json", "os"],
});
const save = createSaveJsonFile(writeFile, os);

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(save, "bun", file, name, json);
