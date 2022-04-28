//@ts-ignore
import path from "path";
//@ts-ignore
import { fileURLToPath } from "url";
import { build } from "esbuild";
import { saveIndexToFile } from "./src/searchIndex.js";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//@ts-ignore
await saveIndexToFile("../latest/data/index.json", "../latest/data/flexsearchIndex.json");

try {
  //@ts-ignore
  await build({
    bundle: true,
    sourcemap: true,
    format: "esm",
    target: "esnext",
    minify: true,
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outdir: path.join(__dirname, "dist"),
    outExtension: { ".js": ".mjs" },
  });
} catch {
  //@ts-ignore
  process.exitCode = 1;
}
