import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { walkFiles } from "./client-content-utils.mjs";

const distDir = path.join(process.cwd(), "dist");

function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function toPrecacheUrl(filePath) {
  const relativePath = toPosixPath(path.relative(distDir, filePath));
  return `./${relativePath}`;
}

async function fileHash(filePaths) {
  const hash = createHash("sha256");
  for (const filePath of filePaths) {
    hash.update(toPosixPath(path.relative(distDir, filePath)));
    hash.update(await readFile(filePath));
  }
  return hash.digest("hex").slice(0, 12);
}

if (!existsSync(distDir)) {
  throw new Error("dist 폴더가 없습니다. Vite 빌드 이후에 실행하세요.");
}

const files = (await walkFiles(distDir))
  .filter((filePath) => {
    const relativePath = toPosixPath(path.relative(distDir, filePath));
    return relativePath !== "sw.js" && !relativePath.endsWith(".map");
  })
  .sort((a, b) => toPrecacheUrl(a).localeCompare(toPrecacheUrl(b)));

const version = await fileHash(files);
const precacheUrls = files.map(toPrecacheUrl);

const swSource = `const CACHE_PREFIX = "hillstate-type-guide";
const CACHE_NAME = \`\${CACHE_PREFIX}-${version}\`;
const RUNTIME_CACHE = \`\${CACHE_PREFIX}-runtime-${version}\`;
const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    PRECACHE_URLS.map(async (url) => {
      try {
        const request = new Request(url, { cache: "reload" });
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.warn("[hillstate-sw] precache skipped", url, error);
      }
    }),
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) {
      return cached;
    }
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  const acceptsHtml = request.headers.get("accept")?.includes("text/html") ?? false;

  event.respondWith(
    (request.mode === "navigate" || acceptsHtml ? networkFirst(request) : cacheFirst(request)).catch(async () => {
      if (request.mode === "navigate") {
        const fallback = await caches.match("./index.html", { ignoreSearch: true });
        if (fallback) {
          return fallback;
        }
      }
      throw new Error(\`Offline and no cache match for \${request.url}\`);
    }),
  );
});
`;

await writeFile(path.join(distDir, "sw.js"), swSource, "utf8");
console.log(`Generated PWA service worker with ${precacheUrls.length} cached file(s), version ${version}.`);
