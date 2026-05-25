import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function sdkRootFromLocalProperties() {
  const localPropertiesPath = path.join(process.cwd(), "android", "local.properties");
  if (!existsSync(localPropertiesPath)) {
    return "";
  }

  const contents = readFileSync(localPropertiesPath, "utf8");
  const match = contents.match(/^sdk\.dir=(.+)$/m);
  return match?.[1]?.replace(/\\:/g, ":").replace(/\\\\/g, "\\") ?? "";
}

const sdkRoot = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || sdkRootFromLocalProperties();

if (!sdkRoot || !existsSync(sdkRoot)) {
  throw new Error(
    [
      "Android SDK를 찾지 못했습니다.",
      "로컬에서 APK를 만들려면 Android Studio 또는 Android command-line tools를 설치한 뒤 ANDROID_HOME을 설정하세요.",
      "GitHub Actions 빌드는 .github/workflows/build-android.yml에서 Android SDK를 자동 세팅합니다.",
    ].join(" "),
  );
}

const sdkManagerPath = path.join(sdkRoot, "cmdline-tools", "latest", "bin", process.platform === "win32" ? "sdkmanager.bat" : "sdkmanager");
const platformsDir = path.join(sdkRoot, "platforms");
const requiredPlatformDir = path.join(platformsDir, "android-36");

if (!existsSync(platformsDir)) {
  throw new Error(`Android SDK platforms 폴더가 없습니다. SDK 경로: ${sdkRoot}`);
}

if (!existsSync(requiredPlatformDir)) {
  throw new Error(`Android SDK platform android-36이 없습니다. 설치 명령: sdkmanager "platforms;android-36" "build-tools;36.0.0"`);
}

console.log(`Android SDK detected: ${sdkRoot}${existsSync(sdkManagerPath) ? "" : " (sdkmanager not found, Gradle build may still use installed SDK packages)"}`);
