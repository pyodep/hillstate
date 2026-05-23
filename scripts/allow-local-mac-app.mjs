import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const appPaths = process.argv.slice(2);
const defaultAppPaths = [
  "/Applications/Hillstate Songpa The Grid.app",
  path.resolve("release/mac-arm64/Hillstate Songpa The Grid.app"),
  path.resolve("release/mac/Hillstate Songpa The Grid.app"),
];

const targets = appPaths.length > 0 ? appPaths : defaultAppPaths;
let clearedCount = 0;

for (const appPath of targets) {
  if (!existsSync(appPath)) {
    continue;
  }

  execFileSync("xattr", ["-dr", "com.apple.quarantine", appPath], { stdio: "inherit" });
  execFileSync("codesign", ["--verify", "--deep", "--strict", appPath], { stdio: "inherit" });
  console.log(`Allowed local macOS app: ${appPath}`);
  clearedCount += 1;
}

if (clearedCount === 0) {
  console.error(`No macOS app bundle found. Checked:\n${targets.map((appPath) => `- ${appPath}`).join("\n")}`);
  process.exit(1);
}

