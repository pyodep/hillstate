import { existsSync } from "node:fs";
import { rm, stat } from "node:fs/promises";
import path from "node:path";
import { collectClientContent, walkFiles } from "./client-content-utils.mjs";

const distDir = path.join(process.cwd(), "dist");
const clientDir = path.join(distDir, "client");
const target = process.argv[2] ?? "web";

async function removeIfExists(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }

  await rm(filePath, { force: true, recursive: true });
  return true;
}

const { references: keep } = await collectClientContent(clientDir);

let removedCount = 0;
let removedBytes = 0;
for (const filePath of await walkFiles(clientDir)) {
  // collectClientContent() always yields POSIX-style ("/") reference paths, but
  // path.relative() returns OS-native separators ("\" on Windows). Normalize so
  // the keep-set lookup works on every platform.
  const relativePath = path.relative(clientDir, filePath).split(path.sep).join("/");
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
