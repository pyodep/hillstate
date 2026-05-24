const { app, BrowserWindow, Menu, protocol, shell } = require("electron");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
const appScheme = "hillstate";
const appHost = "app";
const distDir = path.join(__dirname, "../dist");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: appScheme,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

function resolveDistPath(requestUrl) {
  const url = new URL(requestUrl);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/" || pathname === "") {
    pathname = "/index.html";
  }

  const filePath = path.normalize(path.join(distDir, pathname));

  if (filePath !== distDir && !filePath.startsWith(`${distDir}${path.sep}`)) {
    return null;
  }

  return filePath;
}

function registerAppProtocol() {
  protocol.handle(appScheme, async (request) => {
    const filePath = resolveDistPath(request.url);

    if (!filePath) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      const body = await readFile(filePath);
      const contentType = contentTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
      return new Response(body, {
        headers: {
          "content-type": contentType,
        },
      });
    } catch (error) {
      console.error(`Failed to serve ${request.url} from ${filePath}`, error);
      return new Response("Not Found", { status: 404 });
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1179,
    height: 675,
    minWidth: 960,
    minHeight: 550,
    useContentSize: true,
    backgroundColor: "#07102c",
    autoHideMenuBar: true,
    kiosk: true,
    title: "힐스테이트 송파더그리드",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    const parsedUrl = new URL(url);
    const isInternalUrl = isDev ? url.startsWith(process.env.VITE_DEV_SERVER_URL) : parsedUrl.protocol === `${appScheme}:`;

    if (!isInternalUrl) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // 메뉴를 제거했으므로 키오스크 토글 단축키를 직접 연결한다(운영자용 비상 탈출).
  // F11: 키오스크 켜기/끄기, Esc: 키오스크 상태일 때 해제.
  win.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown") {
      return;
    }

    if (input.key === "F11") {
      win.setKiosk(!win.isKiosk());
      event.preventDefault();
    } else if (input.key === "Escape" && win.isKiosk()) {
      win.setKiosk(false);
      event.preventDefault();
    }
  });

  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    return;
  }

  win.loadURL(`${appScheme}://${appHost}/index.html`);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  app.setName("힐스테이트 송파더그리드");
  registerAppProtocol();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
