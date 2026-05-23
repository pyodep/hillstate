import { existsSync } from "node:fs";
import path from "node:path";
import { clientFiles, collectClientContent } from "./client-content-utils.mjs";

const clientDir = path.resolve(process.argv[2] ?? "public/client");

function fail(message) {
  console.error(`Client data path validation failed: ${message}`);
  process.exit(1);
}

if (!existsSync(clientDir)) {
  fail(`${clientDir} 폴더가 없습니다.`);
}

try {
  const { references, siteConfig, unitTypes } = await collectClientContent(clientDir);
  const missingPaths = [];

  for (const referencePath of references) {
    const absolutePath = path.join(clientDir, referencePath);
    if (!existsSync(absolutePath)) {
      missingPaths.push(referencePath);
    }
  }

  if (missingPaths.length > 0) {
    fail(`다음 파일을 찾을 수 없습니다.\n${missingPaths.map((filePath) => `- ${filePath}`).join("\n")}`);
  }

  const seenTypeIds = new Set();
  for (const unitType of unitTypes) {
    if (!unitType.id) {
      fail("타입 데이터에 id가 비어 있는 항목이 있습니다.");
    }

    if (seenTypeIds.has(unitType.id)) {
      fail(`중복 타입 ID가 있습니다: ${unitType.id}`);
    }

    seenTypeIds.add(unitType.id);
  }

  if (!seenTypeIds.has(siteConfig.defaultTypeId)) {
    fail(`${clientFiles.site}의 defaultTypeId(${siteConfig.defaultTypeId})가 타입 데이터에 없습니다.`);
  }

  console.log(`Validated ${references.size} client data path(s) in ${path.relative(process.cwd(), clientDir) || clientDir}.`);
} catch (error) {
  fail(error.message);
}

