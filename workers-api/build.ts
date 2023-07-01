//@ts-ignore
import path from "path";
//@ts-ignore
import { fileURLToPath } from "url";
import { build } from "esbuild";
import { saveIndexToFile } from "./src/searchIndex.js";
import { saveSQLToFile } from "./src/database.js";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = "../data";

//@ts-ignore
await saveIndexToFile(`${DATA_PATH}/index.json`, "../data/flexsearchIndex.json");

// Generate the SQL for the Cloudflare D1 database
saveSQLToFile(DATA_PATH, `${DATA_PATH}/db.sql`);

try {
  //@ts-ignore
  await build({
    bundle: true,
    sourcemap: true,
    format: "esm",
    target: "esnext",
    external: ["__STATIC_CONTENT_MANIFEST"],
    minify: true,
    entryPoints: [path.join(__dirname, "src", "index.ts")],
    outdir: path.join(__dirname, "dist"),
    outExtension: { ".js": ".mjs" },
  });
} catch {
  //@ts-ignore
  process.exitCode = 1;
}
