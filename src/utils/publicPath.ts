const CLIENT_ROOT = "client";
const externalUrlPattern = /^(https?:)?\/\//;
const contentVersion = import.meta.env.VITE_CONTENT_VERSION;

function isExternalPath(path: string) {
  return externalUrlPattern.test(path) || path.startsWith("data:") || path.startsWith("blob:");
}

function normalizeClientRelativePath(path: string) {
  let cleanPath = path.trim().replace(/\\/g, "/").replace(/^\/+/, "");

  if (cleanPath === CLIENT_ROOT || cleanPath.startsWith(`${CLIENT_ROOT}/`)) {
    cleanPath = cleanPath.slice(CLIENT_ROOT.length).replace(/^\/+/, "");
  }

  return cleanPath;
}

function appendContentVersion(path: string) {
  if (!contentVersion) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${encodeURIComponent(contentVersion)}`;
}

export function publicPath(path?: string) {
  if (!path) {
    return "";
  }

  if (isExternalPath(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const cleanPath = path.replace(/^\/+/, "");

  if (base === "/") {
    return `/${cleanPath}`;
  }

  return `${base.replace(/\/+$/, "")}/${cleanPath}`;
}

export function clientContentPath(path: string) {
  return appendContentVersion(publicPath(`${CLIENT_ROOT}/${normalizeClientRelativePath(path)}`));
}

export function clientAssetPath(path?: string) {
  if (!path) {
    return "";
  }

  if (isExternalPath(path)) {
    return path;
  }

  return clientContentPath(path);
}
