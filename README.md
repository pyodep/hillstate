# 힐스테이트 송파더그리드 타입별 세대 안내

React + TypeScript + Vite 기반의 타입별 세대 안내 프로토타입입니다. 메인 화면, 타입 선택 화면, 타입 상세 화면으로 구성되어 있고, 운영 데이터는 `public/data` 아래 JSON 또는 CSV로 관리합니다.

## 실행

```bash
npm install
npm run dev
```

## GitHub Pages 배포

이 프로젝트는 GitHub Actions로 `dist`를 빌드해서 GitHub Pages에 배포할 수 있습니다.

1. GitHub 저장소에 코드를 push합니다.
2. 저장소의 `Settings` → `Pages`로 이동합니다.
3. `Build and deployment`의 `Source`를 `GitHub Actions`로 선택합니다.
4. `main` 또는 `master` 브랜치에 push하면 `.github/workflows/deploy-pages.yml`이 자동으로 실행됩니다.

프로젝트 페이지 주소는 보통 아래 형식입니다.

```txt
https://사용자명.github.io/저장소명/
```

workflow가 저장소명을 기준으로 Vite `base` 경로를 자동 설정합니다. 저장소가 `사용자명.github.io` 형태인 사용자/조직 Pages 저장소라면 `/` 기준으로 빌드됩니다.

## 운영 데이터 수정

- 프로젝트명, 문구, 로고, 배경, 기본 타입, 색상: `public/data/site-config.json`
- 타입별 세대수와 면적: `public/data/types.json`
- CSV를 쓰고 싶으면 `public/data/types.csv`를 수정한 뒤 `site-config.json`의 `dataSource`를 `"csv"`로 변경
- 화면 위치와 크기: `public/data/layouts/*.json`

## 타입 추가

`public/data/types.json`에 아래 구조로 항목을 추가합니다. `display.order`가 낮을수록 먼저 표시됩니다.

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
    "floorPlan": "/assets/floorplans/34A.png",
    "keyMap": "/assets/keymaps/34A.png"
  },
  "display": {
    "enabled": true,
    "order": 1,
    "highlight": true
  }
}
```

## 타입 숨김 또는 순서 변경

- 숨김: `display.enabled`를 `false`로 변경
- 순서 변경: `display.order` 숫자 변경
- 기본 강조 타입: `site-config.json`의 `defaultTypeId` 변경

## 이미지 교체

- 배경: `public/assets/backgrounds`
- 로고: `public/assets/logos`
- 평면도: `public/assets/floorplans`
- 키맵: `public/assets/keymaps`

이미지 파일을 교체한 뒤 `types.json` 또는 `site-config.json`의 경로와 파일명이 일치하는지 확인하세요. 현재 프로토타입은 34A 평면도와 키맵만 실제 이미지가 연결되어 있으며, 나머지 타입은 상세 화면에서 준비 중 fallback을 표시합니다.

## 오류 확인

화면에 `데이터 설정 오류`가 표시되면 다음을 확인하세요.

- `types.json`에 중복 `id`가 없는지
- 세대수와 면적 값이 숫자인지
- `display.order`가 숫자인지
- 로고와 배경 경로가 `/assets/...`로 시작하는지
- JSON 마지막 항목 뒤에 불필요한 쉼표가 없는지
