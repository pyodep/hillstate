export function publicPath(path?: string) {
  if (!path) {
    return "";
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const cleanPath = path.replace(/^\/+/, "");

  if (base === "/") {
    return `/${cleanPath}`;
  }

  return `${base.replace(/\/+$/, "")}/${cleanPath}`;
}
