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

function runYarnWhy(root: string, packageName: string) {
  const output = execSync(`yarn why ${packageName} --json`, {
    cwd: root,
  }).toString();
  const lines = output.split("\n").filter((line) => line.trim() !== ""); // remove empty lines
  return lines.map((line) => JSON.parse(line));
}

function findPackageVersion(
  root: string,
  workspaceName: string,
  packageName: string,
): string | null {
  const data = runYarnWhy(root, packageName);

  // Find the entry for the specific workspace
  const workspaceEntry = data.find((entry) =>
    entry.value.startsWith(workspaceName + "@workspace:"),
  );

  if (!workspaceEntry) {
    return null;
  }

  // Look for the package within the workspace's children
  for (const [key, child] of Object.entries(workspaceEntry.children)) {
    if (key.startsWith(packageName + "@")) {
      // Extract version from the locator
      // @ts-ignore
      const versionMatch = child.locator.match(/(?:@npm:|#npm:)([^#]+)$/);
      if (versionMatch && versionMatch[1]) {
        return versionMatch[1]; // This will return only the version, e.g. "0.3.0"
      }
    }
  }

  return null; // Package was not found within the workspace's children.
}

function getProductionPackages(
  root: string,
  licenses: Dict<License>,
  workspaceName: string,
  packageNames: string[],
) {
  const prod: Dict<License> = {};
  for (const packageName of packageNames) {
    const version = findPackageVersion(root, workspaceName, packageName);
    if (version === null) {
      throw Error(
        `getProductionPackages: could not find a version for ${packageName} in workspace ${workspaceName}`,
      );
    }
    const key = `${packageName}@${version}`;
    console.log(`${workspaceName}: ${key}`);
    if (licenses[key] == null) {
      throw Error(`getProductionPackages: ${key} not found in licenses index`);
    }
    prod[key] = licenses[key];
  }
  return prod;
}

function getPackagesFromPackageJSON(filePath: string): string[] {
  const packageJson = loadJSON(filePath);
  return Object.keys(packageJson.dependencies);
}

function makeLicenses(root: string) {
  console.log("Making licenses");

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
  for (const workspaceName of workspaces) {
    console.log(`Building licenses for workspace: ${workspaceName}`);

    const packageNames = getPackagesFromPackageJSON(
      path.join(root, workspaceName, "package.json"),
    );
    const data = getProductionPackages(
      root,
      licenses,
      workspaceName,
      packageNames,
    );

    // Save output
    const outputPath = path.join(
      root,
      "data",
      `licenses-${workspaceName}.json`,
    );
    const jsonString = JSON.stringify(data, null, 4);
    fs.writeFileSync(outputPath, jsonString, "utf-8");

    console.log(`Saving license information to: ${outputPath}`);
  }
}

if (process.argv.length > 2) {
  const root = path.resolve(process.argv[2]);
  console.log(`Running in directory: ${root}`);
  makeLicenses(root);
} else {
  console.log("Please provide the path to the root of the project.");
}
