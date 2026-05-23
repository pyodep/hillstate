import { existsSync } from "node:fs";
import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");
const clientDir = path.join(distDir, "client");
const target = process.argv[2] ?? "web";

function normalizeClientPath(value) {
  return value?.replace(/^\/+/, "");
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function walkFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }
  return files;
}

async function removeIfExists(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  await rm(filePath, { force: true, recursive: true });
  return true;
}

const sitePath = path.join(clientDir, "site.json");
const unitTypesPath = path.join(clientDir, "datasets/unit-types.json");
const siteConfig = await readJson(sitePath);
const unitTypes = await readJson(unitTypesPath);
const keep = new Set([
  "site.json",
  "layouts/main.json",
  "layouts/type-list.json",
  "layouts/type-detail.json",
]);

if (siteConfig.dataSource === "csv") {
  keep.add("datasets/unit-types.csv");
} else {
  keep.add("datasets/unit-types.json");
}

for (const backgroundPath of Object.values(siteConfig.backgrounds ?? {})) {
  const normalizedPath = normalizeClientPath(backgroundPath);
  if (normalizedPath) {
    keep.add(normalizedPath);
  }
}

for (const logo of [...(siteConfig.logos ?? []), ...(siteConfig.detailLogos ?? [])]) {
  const normalizedPath = normalizeClientPath(logo.src);
  if (normalizedPath) {
    keep.add(normalizedPath);
  }
}

for (const unitType of unitTypes) {
  const floorPlanPath = normalizeClientPath(unitType.images?.floorPlan);
  const keyMapPath = normalizeClientPath(unitType.images?.keyMap);
  if (floorPlanPath) {
    keep.add(floorPlanPath);
  }
  if (keyMapPath) {
    keep.add(keyMapPath);
  }
}

let removedCount = 0;
let removedBytes = 0;
for (const filePath of await walkFiles(clientDir)) {
  const relativePath = path.relative(clientDir, filePath);
  const shouldKeep = keep.has(relativePath);
  const isJunk = relativePath === "README.md" || relativePath.endsWith(".DS_Store");

  if (!shouldKeep || isJunk) {
    const fileStat = await stat(filePath);
    await rm(filePath, { force: true });
    removedCount += 1;
    removedBytes += fileStat.size;
  }
}

if (target === "electron") {
  const removed404 = await removeIfExists(path.join(distDir, "404.html"));
  if (removed404) {
    removedCount += 1;
  }
}

console.log(`Pruned ${removedCount} dist file(s), ${Math.round(removedBytes / 1024)} KiB removed.`);
