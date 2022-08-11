import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { load } from "../runner.js";
import { createSaveJsonFile } from "../utils.js";

const options = {
  name: { type: "string" },
  file: { type: "string" },
  json: { type: "string" },
  os: { type: "string" },
};
const { values: { file, name, json, os } } = parseArgs({ options });
const save = createSaveJsonFile(writeFile, os);

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(save, "node", file, name, json);
