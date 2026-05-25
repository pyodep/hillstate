import { rm, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const clientDir = path.join(rootDir, "public/client");
const datasetsDir = path.join(clientDir, "datasets");
const sitePath = path.join(clientDir, "site.json");
const unitTypesPath = path.join(datasetsDir, "unit-types.json");
const unitTypesCsvPath = path.join(datasetsDir, "unit-types.csv");
const typeDetailLayoutPath = path.join(clientDir, "layouts/type-detail.json");
const floorplanSourceDir = path.join(rootDir, "datas/평면도 모음-260523");
const keymapSourceDir = path.join(rootDir, "datas/KEYMAP 모음-260522");
const floorplanTargetDir = path.join(clientDir, "floorplans");
const keymapTargetDir = path.join(clientDir, "keymaps");

const floorplanDisplayScale = 0.208;
const keymapMaxDimension = null;
const backgroundQuality = 96;

function csvValue(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function sourceFileMap(sourceDir, prefix = "") {
  const names = await readdir(sourceDir);
  const files = new Map();
  for (const name of names) {
    if (!name.endsWith(".png")) continue;
    const id = name.replace(prefix, "").replace(/\.png$/i, "");
    files.set(id, path.join(sourceDir, name));
  }
  return files;
}

function floorplanDisplaySize(metadata, layout) {
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const scale = Math.min(floorplanDisplayScale, layout.floorPlan.maxWidth / width, layout.floorPlan.maxHeight / height);

  return {
    height: Math.round(height * scale),
    width: Math.round(width * scale),
  };
}

async function optimizeImage(sourcePath, targetPath, options) {
  const source = sharp(sourcePath);
  const metadata = await source.metadata();

  await source.webp(options).toFile(targetPath);

  return {
    height: metadata.height,
    width: metadata.width,
  };
}

async function optimizeFloorplan(sourcePath, targetPath, layout) {
  const source = sharp(sourcePath);
  const metadata = await source.metadata();
  const displaySize = floorplanDisplaySize(metadata, layout);

  await source
    .resize({
      width: displaySize.width,
      height: displaySize.height,
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.55, m1: 0.8, m2: 1.4 })
    .webp({
      effort: 6,
      lossless: true,
    })
    .toFile(targetPath);

  return displaySize;
}

const unitTypes = JSON.parse(await readFile(unitTypesPath, "utf8"));
const siteConfig = JSON.parse(await readFile(sitePath, "utf8"));
const typeDetailLayout = JSON.parse(await readFile(typeDetailLayoutPath, "utf8"));
const floorplanSources = await sourceFileMap(floorplanSourceDir);
const keymapSources = await sourceFileMap(keymapSourceDir, "KEYMAP-");

await rm(floorplanTargetDir, { recursive: true, force: true });
await rm(keymapTargetDir, { recursive: true, force: true });
await mkdir(floorplanTargetDir, { recursive: true });
await mkdir(keymapTargetDir, { recursive: true });

for (const unitType of unitTypes) {
  const floorplanSource = floorplanSources.get(unitType.id) ?? (unitType.id === "119A" ? floorplanSources.get("119") : undefined);
  const keymapSource = keymapSources.get(unitType.id);

  if (!floorplanSource) {
    throw new Error(`${unitType.id} 타입의 평면도 원본을 찾을 수 없습니다.`);
  }

  if (!keymapSource) {
    throw new Error(`${unitType.id} 타입의 키맵 원본을 찾을 수 없습니다.`);
  }

  const floorplanTarget = `floorplans/${unitType.id}.webp`;
  const keymapTarget = `keymaps/${unitType.id}.webp`;
  const floorplanSize = await optimizeFloorplan(floorplanSource, path.join(clientDir, floorplanTarget), typeDetailLayout);

  await optimizeImage(keymapSource, path.join(clientDir, keymapTarget), {
    effort: 6,
    lossless: true,
  });

  unitType.images.floorPlan = floorplanTarget;
  unitType.images.floorPlanSize = floorplanSize;
  unitType.images.keyMap = keymapTarget;
}

await writeFile(unitTypesPath, `${JSON.stringify(unitTypes, null, 2)}\n`);

typeDetailLayout.floorPlan.sourceScale = 1;
await writeFile(typeDetailLayoutPath, `${JSON.stringify(typeDetailLayout, null, 2)}\n`);

for (const [key, backgroundPath] of Object.entries(siteConfig.backgrounds ?? {})) {
  if (!backgroundPath) continue;

  const sourcePath = path.join(clientDir, backgroundPath);
  const parsedPath = path.parse(backgroundPath);
  const targetPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
  const absoluteTargetPath = path.join(clientDir, targetPath);

  if (path.extname(backgroundPath).toLowerCase() !== ".webp") {
    await sharp(sourcePath)
      .webp({
        effort: 6,
        quality: backgroundQuality,
        smartSubsample: true,
      })
      .toFile(absoluteTargetPath);
    siteConfig.backgrounds[key] = targetPath;
  }
}

await writeFile(sitePath, `${JSON.stringify(siteConfig, null, 2)}\n`);

const csvHeaders = [
  "id",
  "label",
  "householdCount",
  "exclusiveArea",
  "commonArea",
  "supplyArea",
  "contractArea",
  "floorPlan",
  "floorPlanWidth",
  "floorPlanHeight",
  "keyMap",
  "enabled",
  "order",
  "highlight",
];

const csvRows = unitTypes.map((unitType) => [
  unitType.id,
  unitType.label,
  unitType.householdCount,
  unitType.areas.exclusive,
  unitType.areas.common,
  unitType.areas.supply,
  unitType.areas.contract,
  unitType.images.floorPlan,
  unitType.images.floorPlanSize?.width ?? "",
  unitType.images.floorPlanSize?.height ?? "",
  unitType.images.keyMap,
  unitType.display.enabled,
  unitType.display.order,
  unitType.display.highlight ?? false,
]);

await writeFile(unitTypesCsvPath, `${[csvHeaders, ...csvRows].map((row) => row.map(csvValue).join(",")).join("\n")}\n`);

console.log(`Optimized ${unitTypes.length} floorplans and keymaps.`);
