const CLIENT_ROOT = "client";
const externalUrlPattern = /^(https?:)?\/\//;
const contentVersion = import.meta.env.VITE_CONTENT_VERSION;

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

  if (externalUrlPattern.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
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
  return appendContentVersion(publicPath(`${CLIENT_ROOT}/${path.replace(/^\/+/, "")}`));
}

export function clientAssetPath(path?: string) {
  if (!path) {
    return "";
  }

  if (externalUrlPattern.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  if (path.startsWith("/")) {
    return appendContentVersion(publicPath(path));
  }

  return clientContentPath(path);
}
