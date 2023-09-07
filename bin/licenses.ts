import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import Dict = NodeJS.Dict;

interface License {
  licenses: string;
  repository: string;
  publisher: string;
  path: string;
  licenseFile: string;
  licenseText: string;
  copyright: string;
  name: string;
  version: string;
}

function loadJSON(filePath: string) {
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(fileContent);
}

function getProductionDependencies(
  licenses: Dict<License>,
  dependencyNames: string[],
) {
  const prod: Dict<License> = {};
  for (const name of dependencyNames) {
    for (let [key, value] of Object.entries(licenses)) {
      if (value != null && name === value.name) {
        prod[key] = value;
        break;
      }
    }
  }
  return prod;
}

function getDependenciesFromPackageJson(filePath: string): string[] {
  const packageJson = loadJSON(filePath);
  return Object.keys(packageJson.dependencies);
}

function makeLicenses(root: string) {
  // Run license-checker program
  execSync(
    "license-checker-rseidelsohn --customPath ./bin/customFormat.json --clarificationsFile ./bin/clarifications.json --json > ./data/licenses.json",
    {
      cwd: root,
      stdio: "inherit",
    },
  );

  // Load licenses and names of production dependencies
  const licenses = loadJSON(path.join(root, "data", "licenses.json"));

  // Build licenses for all workspaces
  const workspaces = ["dashboard", "workers-api", "workers-images"];
  for (const name of workspaces) {
    const deps = getDependenciesFromPackageJson(
      path.join(root, name, "package.json"),
    );
    const data = getProductionDependencies(licenses, deps);

    // Save output
    const jsonString = JSON.stringify(data, null, 4);
    fs.writeFileSync(
      path.join(root, "data", `licenses-${name}.json`),
      jsonString,
      "utf-8",
    );
  }
}

if (process.argv.length > 2) {
  const root = path.resolve(process.argv[2]);
  console.log(`Running in directory: ${root}`);
  makeLicenses(root);
} else {
  console.log("Please provide the path to the root of the project.");
}
