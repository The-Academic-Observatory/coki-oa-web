import { Entity } from "../dashboard/src/lib/model";
import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import { exec, spawn } from "child_process";

export type Task = {
  url: string;
  entity: Entity;
};

const port = 3000;

function makeImagePath(entityId: string) {
  return `../workers-images/public/social-cards/${entityId}.jpg`;
}

export async function makeShareCards(
  inputPath: string,
  maxConcurrency: number,
  cardSelector: string = ".socialCard",
) {
  const cluster = await Cluster.launch({
    puppeteerOptions: {
      product: "firefox",
      defaultViewport: { width: 1200, height: 628 },
    },
    concurrency: Cluster.CONCURRENCY_BROWSER,
    maxConcurrency: maxConcurrency,
  });

  // Make social-cards folder
  const dir = "../workers-images/public/social-cards";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await cluster.task(async ({ page, data }) => {
    const url = data.url;
    const path = makeImagePath(data.entity.id);
    console.log(`Fetching page: ${url}`);
    await page.goto(url);
    await page.waitForSelector(cardSelector);
    const element = await page.$(cardSelector);

    if (element !== null) {
      console.log(`Saving screenshot to: ${path}`);
      await element.screenshot({ path: path, quality: 90 });
      console.log(`Done saving screenshot to: ${path}`);

      // Close page and browser to stop memory leak when using Cluster.CONCURRENCY_BROWSER
      await page.close();
      console.log(`Closed page for: ${path}`);

      await page.browser().close();
      console.log(`Closed browser for: ${path}`);
    }
  });

  //@ts-ignore
  let entities: Array<Entity> = JSON.parse(fs.readFileSync(inputPath));
  console.log(`Total entities: ${entities.length}`);
  entities = entities.filter(
    (entity) => !fs.existsSync(makeImagePath(entity.id)),
  );
  console.log(`Entities to render: ${entities.length}`);
  for (const entity of entities) {
    const task = {
      url: `http://localhost:${port}/cards/${entity.entity_type}/${entity.id}/`,
      entity: entity,
    } as Task;
    await cluster.queue(task);
  }

  await cluster.idle();
  await cluster.close();
}

// Start next.js server
const server = spawn("yarn", ["workspace", "dashboard", "run", "dev"], {
  cwd: "../",
});

// Render cards
await makeShareCards("../data/data/index.json", 32);

// Kill yarn
server.kill();

// Kill next.js server
const lsof = exec(`lsof -t -i:${port}`);
if (lsof.stdout !== null) {
  lsof.stdout.on("data", (ports: string) => {
    exec(`kill ${ports}`);
  });
}
