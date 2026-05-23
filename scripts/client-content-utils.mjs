import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

export const CLIENT_ROOT = "client";

export const clientFiles = {
  site: "site.json",
  typesJson: "datasets/unit-types.json",
  typesCsv: "datasets/unit-types.csv",
  layouts: {
    main: "layouts/main.json",
    typeList: "layouts/type-list.json",
    typeDetail: "layouts/type-detail.json",
  },
};

const externalUrlPattern = /^(https?:)?\/\//i;

export function isExternalClientPath(value) {
  return externalUrlPattern.test(value) || value.startsWith("data:") || value.startsWith("blob:");
}

export function normalizeClientPath(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed || isExternalClientPath(trimmed)) {
    return "";
  }

  const barePath = trimmed.split(/[?#]/)[0].replaceAll("\\", "/");
  let cleanPath = barePath.replace(/^\/+/, "");

  if (cleanPath === CLIENT_ROOT || cleanPath.startsWith(`${CLIENT_ROOT}/`)) {
    cleanPath = cleanPath.slice(CLIENT_ROOT.length).replace(/^\/+/, "");
  }

  const normalized = path.posix.normalize(cleanPath);
  if (!normalized || normalized === ".") {
    return "";
  }

  if (normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`client 폴더 밖을 가리키는 경로입니다: ${value}`);
  }

  return normalized;
}

export async function readJson(filePath, label = filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} 파일을 읽거나 파싱하지 못했습니다. ${error.message}`);
  }
}

export async function walkFiles(dir) {
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

function parseCsvTypes(csvText) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`datasets/unit-types.csv 파싱 오류: ${parsed.errors[0].message}`);
  }

  return parsed.data.map((row) => ({
    id: row.id?.trim(),
    label: row.label?.trim(),
    images: {
      floorPlan: row.floorPlan?.trim() || "",
      keyMap: row.keyMap?.trim() || "",
    },
    display: {
      enabled: String(row.enabled).toLowerCase() === "true",
      order: Number(row.order),
    },
  }));
}

async function loadUnitTypes(clientDir, siteConfig) {
  if (siteConfig.dataSource === "csv") {
    const csvPath = path.join(clientDir, clientFiles.typesCsv);
    return parseCsvTypes(await readFile(csvPath, "utf8"));
  }

  return readJson(path.join(clientDir, clientFiles.typesJson), clientFiles.typesJson);
}

function addClientPath(referenceSet, value, label) {
  const normalizedPath = normalizeClientPath(value);
  if (normalizedPath) {
    referenceSet.add(normalizedPath);
    return;
  }

  if (value && !isExternalClientPath(String(value))) {
    throw new Error(`${label} 경로가 비어 있거나 올바르지 않습니다.`);
  }
}

export async function collectClientContent(clientDir) {
  const siteConfig = await readJson(path.join(clientDir, clientFiles.site), clientFiles.site);
  const unitTypes = await loadUnitTypes(clientDir, siteConfig);
  const references = new Set([
    clientFiles.site,
    clientFiles.layouts.main,
    clientFiles.layouts.typeList,
    clientFiles.layouts.typeDetail,
    siteConfig.dataSource === "csv" ? clientFiles.typesCsv : clientFiles.typesJson,
  ]);

  for (const [key, backgroundPath] of Object.entries(siteConfig.backgrounds ?? {})) {
    addClientPath(references, backgroundPath, `backgrounds.${key}`);
  }

  for (const logo of [...(siteConfig.logos ?? []), ...(siteConfig.detailLogos ?? [])]) {
    addClientPath(references, logo.src, `logos.${logo.id ?? "unknown"}`);
  }

  for (const unitType of unitTypes) {
    addClientPath(references, unitType.images?.floorPlan, `${unitType.id} floorPlan`);
    addClientPath(references, unitType.images?.keyMap, `${unitType.id} keyMap`);
  }

  return {
    references,
    siteConfig,
    unitTypes,
  };
}

