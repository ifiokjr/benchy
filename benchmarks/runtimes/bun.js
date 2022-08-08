import mri from "mri";
import { load } from "../runner.js";

const { name, file } = mri(Bun.argv, { string: ["name", "file"] });

if (!name || !file) {
  throw new Error("Please provide a name and file");
}

await load(file, name);
