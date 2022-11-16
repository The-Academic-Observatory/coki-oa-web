//@ts-ignore
import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";
import { saveIndexToFile } from "./src/searchIndex.js";
import { saveSQLToFile } from "./src/database.js";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = "../latest/data";

try {
  // Save FlexSearch index to a file
  // @ts-ignore
  await saveIndexToFile(DATA_PATH, "public/flexsearchIndex.json.gz");

  // Generate the SQL for the Cloudflare D1 database
  saveSQLToFile(DATA_PATH, "../latest/data/db.sql");
} catch {
  process.exitCode = 1;
}

try {
  //@ts-ignore
  await build({
    bundle: true,
    sourcemap: true,
    format: "esm",
    target: "esnext",
    external: ["__STATIC_CONTENT_MANIFEST"],
    conditions: ["worker", "browser"],
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outdir: path.join(__dirname, "dist"),
    outExtension: { ".js": ".mjs" },
    minify: true,
  });
} catch {
  process.exitCode = 1;
}
