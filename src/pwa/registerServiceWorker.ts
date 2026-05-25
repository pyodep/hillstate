const supportedProtocols = new Set(["http:", "https:"]);

function isNativeAppRuntime() {
  return Boolean((window as Window & { Capacitor?: unknown }).Capacitor);
}

function clearNativeRuntimeCaches() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      return Promise.all(registrations.map((registration) => registration.unregister()));
    });

    if ("caches" in window) {
      void caches.keys().then((keys) => {
        return Promise.all(keys.filter((key) => key.startsWith("hillstate-type-guide")).map((key) => caches.delete(key)));
      });
    }
  });
}

function serviceWorkerUrl() {
  const base = import.meta.env.BASE_URL || "/";

  if (base === "./") {
    return new URL("sw.js", window.location.href).toString();
  }

  return new URL(`${base.replace(/\/+$/, "")}/sw.js`, window.location.origin).toString();
}

export function registerServiceWorker() {
  if (isNativeAppRuntime()) {
    clearNativeRuntimeCaches();
    return;
  }

  if (import.meta.env.DEV || !("serviceWorker" in navigator) || !supportedProtocols.has(window.location.protocol)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(serviceWorkerUrl()).catch((error) => {
      console.warn("[hillstate] service worker registration failed", error);
    });
  });
}
