import { parseArgs } from "node:util";
import { load } from "../runner.js";

const options = { name: { type: "string" }, file: { type: "string" } };
const { values: { file, name } } = parseArgs({ options });

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(file, name);