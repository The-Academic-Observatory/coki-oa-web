//@ts-ignore
import path from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";
import { saveIndexToFile } from "./src/searchIndex.js";
import { saveSQLToFile } from "./src/database.js";

//@ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const countryPath = "../latest/data/country.json";
  const institutionPath = "../latest/data/institution.json";

  // Save FlexSearch index to a file
  // @ts-ignore
  await saveIndexToFile(countryPath, institutionPath, "public/flexsearchIndex.json.gz");

  // Generate the SQL for the Cloudflare D1 database
  saveSQLToFile(countryPath, institutionPath, "../latest/data/db.sql");
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
