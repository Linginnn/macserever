// @ts-ignore
import Koa from "koa";
// @ts-ignore
import KoaRouter from "koa-router";
import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { URL } from "url";

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

let data = {
  ipAddr: "虚拟ip",
  macAddr: "C03C590CE244",
};

app.disableHardwareAcceleration();

ipcMain.on("mac", (event, args) => {
  data.macAddr = args.cmac || args.mac;
});

// Install "Vue.js devtools"
if (import.meta.env.MODE === "development") {
  app
    .whenReady()
    .then(() => import("electron-devtools-installer"))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
    )
    .catch((e) => console.error("Failed install extension:", e));
}

let mainWindow: BrowserWindow | null = null;

const koaApp = new Koa();

const router = new KoaRouter();

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      preload: join(__dirname, "../../preload/dist/index.cjs"),
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();

    if (import.meta.env.MODE === "development") {
      mainWindow?.webContents.openDevTools();
    }
    router.get("/api/env", async (ctx: any, next: any) => {
      await next();
      // @ts-ignore
      ctx.body = data;
    });
    koaApp.use(async (ctx: any, next: () => any) => {
      ctx.set("Access-Control-Allow-Origin", "*");
      ctx.set("Access-Control-Allow-Methods", "PUT,DELETE,POST,GET");
      ctx.set("Access-Control-Max-Age", 3600 * 24);
      await next();
    });
    koaApp.use(router.routes());
    koaApp.listen(20509);
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.MODE === "development" &&
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname
        ).toString();

  await mainWindow.loadURL(pageUrl);
};

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error("Failed create window:", e));

// Auto-updates
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}
