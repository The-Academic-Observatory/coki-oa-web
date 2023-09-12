import fs from "fs";
import path from "path";
import { execSync, exec } from "child_process";
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

function runYarnWhy(root: string, packageName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    exec(
      `yarn why ${packageName} --json`,
      { cwd: root },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        const output = stdout.toString();
        const lines = output.split("\n").filter((line) => line.trim() !== ""); // remove empty lines
        resolve(lines.map((line) => JSON.parse(line)));
      },
    );
  });
}
async function findPackageVersion(
  root: string,
  workspaceName: string,
  packageName: string,
): Promise<[string, string | null]> {
  const data = await runYarnWhy(root, packageName);

  // Find the entry for the specific workspace
  const workspaceEntry = data.find((entry) =>
    entry.value.startsWith(workspaceName + "@workspace:"),
  );

  if (!workspaceEntry) {
    return [packageName, null];
  }

  // Look for the package within the workspace's children
  for (const [key, child] of Object.entries(workspaceEntry.children)) {
    if (key.startsWith(packageName + "@")) {
      // Extract version from the locator
      // @ts-ignore
      const versionMatch = child.locator.match(/(?:@npm:|#npm:)([^#]+)$/);
      if (versionMatch && versionMatch[1]) {
        return [packageName, versionMatch[1]]; // This will return only the version, e.g. "0.3.0"
      }
    }
  }

  return [packageName, null]; // Package was not found within the workspace's children.
}

async function getProductionPackages(
  root: string,
  licenses: Dict<License>,
  workspaceName: string,
  packageNames: string[],
): Promise<Dict<License>> {
  const prod: Dict<License> = {};

  // Use Promise.all to wait for all promises to complete
  const packageVersions = await Promise.all(
    packageNames.map((packageName) =>
      findPackageVersion(root, workspaceName, packageName),
    ),
  );

  for (const [packageName, version] of packageVersions) {
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

// This async function represents the logic inside the loop
async function processWorkspace(
  root: string,
  licenses: Dict<License>,
  workspaceName: string,
) {
  console.log(`Building licenses for workspace: ${workspaceName}`);

  const packageNames = getPackagesFromPackageJSON(
    path.join(root, workspaceName, "package.json"),
  );
  const data = await getProductionPackages(
    root,
    licenses,
    workspaceName,
    packageNames,
  );

  // Save output
  const outputPath = path.join(root, "data", `licenses-${workspaceName}.json`);
  const jsonString = JSON.stringify(data, null, 4);
  fs.writeFileSync(outputPath, jsonString, "utf-8");

  console.log(`Saving license information to: ${outputPath}`);
}

function runLicenseChecker(rootPath: string, workspacePath: string) {
  return new Promise((resolve, reject) => {
    exec(
      `license-checker-rseidelsohn --customPath ${rootPath}/bin/customFormat.json --clarificationsFile ${rootPath}/bin/clarifications.json --json`,
      {
        cwd: workspacePath,
        maxBuffer: 100 * 1024 * 1024, // Set maxBuffer to 100 MB
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(stdout));
        }
      },
    );
  });
}

async function makeLicenses(root: string) {
  console.log("Making licenses");

  // Run license-checker program
  const workspacePaths = [
    root,
    path.resolve(root, "dashboard"),
    path.resolve(root, "workers-api"),
    path.resolve(root, "workers-images"),
  ];
  const results = await Promise.all(
    workspacePaths.map((workspacePath) =>
      runLicenseChecker(root, workspacePath),
    ),
  );
  const licenses = Object.assign({}, ...results);

  // Save file which can be inspected
  fs.writeFileSync(
    path.resolve(root, "data", "licenses.json"),
    JSON.stringify(licenses, null, 2),
  );

  // Build licenses for all workspaces
  const workspacesNames = ["dashboard", "workers-api", "workers-images"];
  await Promise.all(
    workspacesNames.map((workspaceName) =>
      processWorkspace(root, licenses, workspaceName),
    ),
  );
}

if (process.argv.length > 2) {
  const root = path.resolve(process.argv[2]);
  console.log(`Running in directory: ${root}`);
  makeLicenses(root).then();
} else {
  console.log("Please provide the path to the root of the project.");
}
