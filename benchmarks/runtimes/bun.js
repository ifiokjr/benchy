import mri from "mri";
import { load } from "../runner.js";

const { name, file, json } = mri(Bun.argv, {
  string: ["name", "file", "json"],
});

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(file, name, json);
