# 힐스테이트 송파더그리드 타입별 세대 안내

React + TypeScript + Vite 기반의 타입별 세대 안내 프로토타입입니다. 메인 화면, 타입 선택 화면, 타입 상세 화면으로 구성되어 있고, 운영자가 수정할 파일은 모두 `public/client` 아래에 모아두었습니다.

## 실행

```bash
npm install
npm run dev
```

## Electron 실행 및 빌드

개발 중 Electron 앱으로 확인할 때는 아래 명령을 사용합니다.

```bash
npm run electron:dev
```

배포용 실행 파일은 `release` 폴더에 생성됩니다.

```bash
# Mac용 DMG 생성
npm run electron:dist:mac

# Windows용 설치 파일과 portable exe 생성
npm run electron:dist:win

# Mac + Windows를 한 번에 생성
npm run electron:dist:all
```

Windows 결과물은 `Hillstate Songpa The Grid-버전-win-x64-setup.exe`와 `Hillstate Songpa The Grid-버전-win-x64-portable.exe`입니다. Mac 결과물은 `Hillstate Songpa The Grid-버전-mac-아키텍처.dmg`입니다.

## 클라이언트 수정 폴더

운영자가 직접 수정하는 파일과 이미지는 `public/client`만 보면 됩니다.

```txt
public/client/
  site.json
  datasets/
    unit-types.json
    unit-types.csv
  backgrounds/
    main.jpg
    type-list.jpg
  logos/
    the-grid.png
    hillstate.png
  floorplans/
    34A.png
  keymaps/
    34A.png
  layouts/
    main.json
    type-list.json
    type-detail.json
```

## 주요 수정 위치

- 프로젝트명, 문구, 로고, 배경, 기본 타입, 색상: `public/client/site.json`
- 타입별 세대수와 면적: `public/client/datasets/unit-types.json`
- CSV를 쓰고 싶으면 `public/client/datasets/unit-types.csv`를 수정한 뒤 `site.json`의 `dataSource`를 `"csv"`로 변경
- 화면 위치와 크기: `public/client/layouts/*.json`
- 평면도 이미지: `public/client/floorplans`
- 키맵 이미지: `public/client/keymaps`
- 상세 화면 전용 흰색 로고: `public/client/logos/the-grid-white.png`, `public/client/logos/hillstate-white.png`

## 타입 추가

`public/client/datasets/unit-types.json`에 아래 구조로 항목을 추가합니다. `display.order`가 낮을수록 먼저 표시됩니다.

```json
{
  "id": "34A",
  "label": "34A",
  "householdCount": 156,
  "areas": {
    "exclusive": 34.993,
    "common": 15.1976,
    "supply": 50.1906,
    "contract": 80.5095
  },
  "images": {
    "floorPlan": "floorplans/34A.png",
    "keyMap": "keymaps/34A.png"
  },
  "display": {
    "enabled": true,
    "order": 1,
    "highlight": true
  }
}
```

이미지 경로는 `public/client` 기준의 상대 경로로 적습니다. 예를 들어 `public/client/floorplans/59A.png` 파일은 `"floorPlan": "floorplans/59A.png"`로 연결합니다.

## 타입 숨김 또는 순서 변경

- 숨김: `display.enabled`를 `false`로 변경
- 순서 변경: `display.order` 숫자 변경
- 기본 강조 타입: `site.json`의 `defaultTypeId` 변경

## 이미지 교체

파일을 같은 이름으로 교체하면 JSON 수정 없이 반영됩니다. 새 파일명으로 추가할 때는 `site.json` 또는 `unit-types.json`의 경로도 같이 바꿉니다.

현재 프로토타입은 34A 평면도와 키맵만 실제 이미지가 연결되어 있으며, 나머지 타입은 상세 화면에서 준비 중 fallback을 표시합니다.

## GitHub Pages 배포

이 프로젝트는 GitHub Actions로 `dist`를 빌드해서 GitHub Pages에 배포합니다.

1. GitHub 저장소에 코드를 push합니다.
2. 저장소의 `Settings` → `Pages`로 이동합니다.
3. `Build and deployment`의 `Source`를 `GitHub Actions`로 선택합니다.
4. `main` 또는 `master` 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 자동으로 실행됩니다.

프로젝트 페이지 주소는 보통 아래 형식입니다.

```txt
https://사용자명.github.io/저장소명/
```

workflow가 저장소명을 기준으로 Vite `base` 경로를 자동 설정합니다. 저장소가 `사용자명.github.io` 형태인 사용자/조직 Pages 저장소라면 `/` 기준으로 빌드됩니다.

## 오류 확인

화면에 `데이터 설정 오류`가 표시되면 다음을 확인하세요.

- `unit-types.json`에 중복 `id`가 없는지
- 세대수와 면적 값이 숫자인지
- `display.order`가 숫자인지
- 이미지 경로가 `floorplans/파일명.png`, `keymaps/파일명.png`처럼 `public/client` 기준으로 적혀 있는지
- JSON 마지막 항목 뒤에 불필요한 쉼표가 없는지
