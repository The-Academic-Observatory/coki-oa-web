import { Entity } from "../lib/model";
import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import { exec, spawn } from "child_process";

export type Task = {
  url: string;
  entity: Entity;
};

const port = 9001;

export async function makeShareCards(inputPath: string, maxConcurrency: number, cardSelector: string = ".socialCard") {
  const cluster = await Cluster.launch({
    puppeteerOptions: {
      product: "firefox",
      defaultViewport: { width: 1200, height: 628 },
    },
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: maxConcurrency,
  });

  // Make social-cards folder
  const dir = "../public/social-cards";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await cluster.task(async ({ page, data }) => {
    const url = data.url;
    const path = `../public/social-cards/${data.entity.id}.png`;
    console.log(`Fetching page: ${url}`);
    await page.goto(url);
    await page.waitForSelector(cardSelector);
    const element = await page.$(cardSelector);

    if (element !== null) {
      console.log(`Saving screenshot to: ${path}`);
      await element.screenshot({ path: path });
    }
  });

  //@ts-ignore
  const entities = JSON.parse(fs.readFileSync(inputPath));
  for (const entity of entities) {
    const task = {
      url: `http://localhost:${port}/${entity.category}-card/${entity.id}/`,
      entity: entity,
    } as Task;
    await cluster.queue(task);
  }

  await cluster.idle();
  await cluster.close();
}

// Start next.js server
const server = spawn("yarn", ["run", "next", "-p", `${port}`], { cwd: "../" });

// Render cards
await makeShareCards("../latest/data/index.json", 4);

// Kill yarn
server.kill();

// Kill next.js server
const lsof = exec(`lsof -t -i:${port}`);
if (lsof.stdout !== null) {
  lsof.stdout.on("data", (ports: string) => {
    exec(`kill ${ports}`);
  });
}
