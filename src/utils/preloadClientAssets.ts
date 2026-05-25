import type { ClientContentData } from "../data/loadClientContent";
import { clientAssetPath } from "./publicPath";

const loadedUrls = new Set<string>();

function addUrl(urls: Set<string>, path?: string) {
  if (!path) {
    return;
  }

  const url = clientAssetPath(path);
  if (url && !loadedUrls.has(url)) {
    urls.add(url);
  }
}

function collectPreloadUrls(data: ClientContentData) {
  const urls = new Set<string>();

  for (const backgroundPath of Object.values(data.siteConfig.backgrounds ?? {})) {
    addUrl(urls, backgroundPath);
  }

  for (const logo of [...(data.siteConfig.logos ?? []), ...(data.siteConfig.detailLogos ?? [])]) {
    addUrl(urls, logo.src);
  }

  for (const unitType of data.unitTypes) {
    addUrl(urls, unitType.images.floorPlan);
    addUrl(urls, unitType.images.keyMap);
  }

  return [...urls];
}

async function preloadUrl(url: string) {
  if (loadedUrls.has(url)) {
    return;
  }

  await fetch(url, { cache: "force-cache" }).catch(() => undefined);
  loadedUrls.add(url);
}

async function preloadQueue(urls: string[], concurrency = 4) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor];
      cursor += 1;
      await preloadUrl(url);
    }
  });

  await Promise.all(workers);
}

export function preloadClientAssets(data: ClientContentData) {
  const urls = collectPreloadUrls(data);
  if (urls.length === 0) {
    return;
  }

  const start = () => {
    void preloadQueue(urls);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 1200 });
  } else {
    setTimeout(start, 250);
  }
}
