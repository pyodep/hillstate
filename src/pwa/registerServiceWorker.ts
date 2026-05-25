const supportedProtocols = new Set(["http:", "https:"]);

function serviceWorkerUrl() {
  const base = import.meta.env.BASE_URL || "/";

  if (base === "./") {
    return new URL("sw.js", window.location.href).toString();
  }

  return new URL(`${base.replace(/\/+$/, "")}/sw.js`, window.location.origin).toString();
}

export function registerServiceWorker() {
  if (import.meta.env.DEV || !("serviceWorker" in navigator) || !supportedProtocols.has(window.location.protocol)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(serviceWorkerUrl()).catch((error) => {
      console.warn("[hillstate] service worker registration failed", error);
    });
  });
}
