import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.hillstate.songpathegrid",
  appName: "Hillstate Songpa The Grid",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#07102c",
  },
};

export default config;
