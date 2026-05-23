import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import Papa from "papaparse";
import { clientFiles, normalizeClientPath } from "./client-content-utils.mjs";

const require = createRequire(import.meta.url);
const asar = require("@electron/asar");
const archivePath = path.resolve(process.argv[2] ?? "release/win-unpacked/resources/app.asar");

function fail(message) {
  console.error(`Electron package validation failed: ${message}`);
  process.exit(1);
}

function archiveEntry(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

function assertEntry(entries, filePath) {
  const normalizedPath = archiveEntry(filePath);
  if (!entries.has(normalizedPath)) {
    fail(`${normalizedPath} 파일이 패키지에 없습니다.`);
  }

  // asar resolves entries by splitting on path.sep internally, so a POSIX-style
  // ("/") path with nested folders fails to resolve on Windows. Hand extractFile
  // an OS-native path while keeping the "/" form for the entries lookup above.
  const archivePathForAsar = normalizedPath.split("/").join(path.sep);
  const content = asar.extractFile(archivePath, archivePathForAsar);
  if (!content || content.length === 0) {
    fail(`${normalizedPath} 파일이 비어 있습니다.`);
  }

  return content;
}

function readJson(entries, filePath) {
  const content = assertEntry(entries, filePath);
  try {
    return JSON.parse(content.toString("utf8"));
  } catch (error) {
    fail(`${archiveEntry(filePath)} 파일을 JSON으로 읽을 수 없습니다. ${error.message}`);
  }
}

function parseCsvTypes(csvText) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    fail(`dist/client/${clientFiles.typesCsv} 파싱 오류: ${parsed.errors[0].message}`);
  }

  return parsed.data.map((row) => ({
    id: row.id?.trim(),
    images: {
      floorPlan: row.floorPlan?.trim() || "",
      keyMap: row.keyMap?.trim() || "",
    },
  }));
}

function addClientReference(references, value) {
  const normalizedPath = normalizeClientPath(value);
  if (normalizedPath) {
    references.add(`dist/client/${normalizedPath}`);
  }
}

if (!existsSync(archivePath)) {
  fail(`${archivePath} 파일이 없습니다.`);
}

const entries = new Set(asar.listPackage(archivePath).map(archiveEntry));
assertEntry(entries, "package.json");
assertEntry(entries, "electron/main.cjs");
assertEntry(entries, "dist/index.html");

const siteConfig = readJson(entries, `dist/client/${clientFiles.site}`);
assertEntry(entries, `dist/client/${clientFiles.layouts.main}`);
assertEntry(entries, `dist/client/${clientFiles.layouts.typeList}`);
assertEntry(entries, `dist/client/${clientFiles.layouts.typeDetail}`);

const unitTypes =
  siteConfig.dataSource === "csv"
    ? parseCsvTypes(assertEntry(entries, `dist/client/${clientFiles.typesCsv}`).toString("utf8"))
    : readJson(entries, `dist/client/${clientFiles.typesJson}`);

const references = new Set();
for (const backgroundPath of Object.values(siteConfig.backgrounds ?? {})) {
  addClientReference(references, backgroundPath);
}

for (const logo of [...(siteConfig.logos ?? []), ...(siteConfig.detailLogos ?? [])]) {
  addClientReference(references, logo.src);
}

for (const unitType of unitTypes) {
  addClientReference(references, unitType.images?.floorPlan);
  addClientReference(references, unitType.images?.keyMap);
}

for (const referencePath of references) {
  assertEntry(entries, referencePath);
}

console.log(`Validated ${references.size} packaged client asset(s) in ${path.relative(process.cwd(), archivePath) || archivePath}.`);

