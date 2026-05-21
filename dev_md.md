# 힐스테이트 송파더그리드 타입별 세대 안내 웹/앱 개발 명세서

## 0. 목적

본 문서는 Codex, Cursor, Claude Code 등 에이전틱 코딩 도구가 바로 작업할 수 있도록 작성한 개발 명세서이다.

개발 대상은 분양/홍보관 또는 고객 안내용 **타입별 세대 안내 인터랙티브 웹사이트**이다.  
초기 화면, 타입 선택 화면, 타입 상세 화면으로 구성되며, 타입별 데이터는 운영자가 직접 수정할 수 있도록 `JSON` 또는 `CSV` 기반으로 관리한다.

향후 다음 가능성을 반드시 고려한다.

- 웹으로 우선 개발
- 필요 시 Electron으로 데스크톱 앱 빌드
- 화면 레이아웃이 변경될 가능성 있음
- 타입 데이터가 계속 수정될 가능성 있음
- 비개발자가 타입별 면적, 세대수, 이미지, 평면도 등을 수정할 수 있어야 함
- 배경 이미지, 로고, 버튼 문구, 색상, 타입 목록, 상세 항목이 프로젝트마다 바뀔 수 있음

---

## 1. 구현 대상 화면

첨부된 예시 이미지는 다음 3개 화면 구조를 가진다.

### 1.1 메인 화면

역할:

- 브랜드/프로젝트 소개
- 배경 조감도 표시
- 로고 표시
- CTA 버튼 클릭 시 타입 선택 화면으로 이동

화면 요소:

- 전체 배경 이미지
- 상단 우측 로고 2개
  - THE GRID
  - HILLSTATE
- 중앙 문구
  - 예: `미래비전을 품은 복정역 스마트시티의 완성`
  - 예: `힐스테이트 송파더그리드`
- CTA 버튼
  - 예: `타입별 세대 안내 >>`

### 1.2 타입 선택 화면

역할:

- 사용자가 원하는 타입을 선택
- 선택된 타입 버튼은 강조 표시
- 타입 버튼 클릭 시 상세 화면으로 이동

화면 요소:

- 배경 이미지
- 상단 좌측 뒤로가기/메인 버튼
- 상단 우측 로고
- 중앙 제목
  - 예: `힐스테이트 송파더그리드`
  - 예: `타입별 세대 안내`
- 타입 버튼 그리드
  - 예: `34A`, `34B`, `36`, `42A`, `42B1`, ...
- 현재 선택 또는 기본 타입은 빨간색 강조
- 타입 수가 많아도 유지보수 가능해야 함

### 1.3 타입 상세 화면

역할:

- 특정 타입의 세대수, 면적 정보, 평면도, 키맵을 표시
- 타입 선택 화면에서 선택한 타입에 따라 데이터가 변경됨

화면 요소:

- 좌측 상단 KEY MAP
- 키맵 이미지
- 좌측 대형 타입명
  - 예: `34A`
- 좌측 타입 정보
  - 세대수
  - 전용면적
  - 공용면적
  - 공급면적
  - 계약면적
- 우측 또는 중앙 평면도 이미지
- 상단 우측 로고
- 우측 하단 홈 버튼

---

## 2. 핵심 설계 원칙

### 2.1 데이터와 화면 레이아웃 분리

타입별 세대수, 면적, 이미지 경로, 버튼 목록 등은 React 코드에 하드코딩하지 않는다.

반드시 다음 파일로 분리한다.

```txt
/public/data/site-config.json
/public/data/types.json
/public/data/layouts/main-layout.json
/public/data/layouts/type-list-layout.json
/public/data/layouts/type-detail-layout.json
```

또는 CSV 관리가 필요하면 다음도 지원한다.

```txt
/public/data/types.csv
```

개발 우선순위는 JSON이다.  
CSV는 운영자 편집 편의성을 위한 선택 기능으로 구현한다.

### 2.2 운영자가 수정할 수 있는 항목

운영자가 코드 수정 없이 변경할 수 있어야 하는 항목:

- 프로젝트명
- 메인 문구
- CTA 버튼 문구
- 타입 목록
- 타입별 세대수
- 전용면적
- 공용면적
- 공급면적
- 계약면적
- 타입별 평면도 이미지
- 타입별 키맵 이미지
- 배경 이미지
- 로고 이미지
- 버튼 색상
- 기본 선택 타입
- 상세 화면의 표시 항목 순서
- 화면 텍스트 크기 및 위치 일부

단, 완전한 WYSIWYG 편집기까지는 1차 구현 범위에 넣지 않는다.  
1차 목표는 JSON/CSV 파일 수정만으로 운영 가능하게 만드는 것이다.

### 2.3 웹 우선, Electron 선택 빌드

기본은 React 기반 웹앱으로 개발한다.

Electron은 다음 조건을 만족하도록 별도 옵션으로 구성한다.

- 인터넷 없이 로컬 실행 가능
- `/public/data`와 `/public/assets`를 같이 패키징
- 빌드 결과물을 Windows/macOS에서 실행 가능
- Electron 없이도 웹 배포 가능

---

## 3. 권장 기술 스택

### 3.1 기본

```txt
React
TypeScript
Vite
CSS Modules 또는 Tailwind CSS
React Router
```

### 3.2 선택

```txt
Electron
electron-vite
electron-builder
PapaParse    # CSV 파싱이 필요한 경우
Zod          # JSON 데이터 검증
```

### 3.3 권장 패키지

```bash
npm create vite@latest hillstate-type-guide -- --template react-ts
cd hillstate-type-guide

npm install react-router-dom zod
npm install papaparse
npm install -D @types/papaparse
```

Electron까지 고려할 경우:

```bash
npm install -D electron electron-vite electron-builder
```

---

## 4. 권장 폴더 구조

```txt
hillstate-type-guide/
  public/
    assets/
      backgrounds/
        main-bg.jpg
        type-list-bg.jpg
        detail-bg.jpg
      logos/
        the-grid.png
        hillstate.png
      keymaps/
        34A.png
        34B.png
      floorplans/
        34A.png
        34B.png
      icons/
        home.svg
        back.svg

    data/
      site-config.json
      types.json
      types.csv
      layouts/
        main-layout.json
        type-list-layout.json
        type-detail-layout.json

  src/
    app/
      App.tsx
      router.tsx

    pages/
      MainPage.tsx
      TypeListPage.tsx
      TypeDetailPage.tsx

    components/
      LogoGroup.tsx
      BackButton.tsx
      HomeButton.tsx
      TypeButtonGrid.tsx
      TypeInfoPanel.tsx
      FloorPlanViewer.tsx
      KeyMapViewer.tsx
      BackgroundLayout.tsx

    data/
      loadSiteConfig.ts
      loadTypes.ts
      loadLayoutConfig.ts
      schemas.ts

    types/
      site.ts
      unit.ts
      layout.ts

    styles/
      globals.css
      variables.css

    utils/
      assetPath.ts
      formatArea.ts

  electron/
    main.ts
    preload.ts

  package.json
  vite.config.ts
  tsconfig.json
  README.md
```

---

## 5. 데이터 설계

## 5.1 site-config.json

프로젝트 전체 설정 파일이다.

```json
{
  "projectName": "힐스테이트 송파더그리드",
  "subtitle": "미래비전을 품은 복정역 스마트시티의 완성",
  "typeListTitle": "타입별 세대 안내",
  "defaultTypeId": "34A",
  "logos": [
    {
      "id": "the-grid",
      "src": "/assets/logos/the-grid.png",
      "alt": "THE GRID"
    },
    {
      "id": "hillstate",
      "src": "/assets/logos/hillstate.png",
      "alt": "HILLSTATE"
    }
  ],
  "backgrounds": {
    "main": "/assets/backgrounds/main-bg.jpg",
    "typeList": "/assets/backgrounds/type-list-bg.jpg",
    "detail": "/assets/backgrounds/detail-bg.jpg"
  },
  "cta": {
    "label": "타입별 세대 안내 >>",
    "target": "/types"
  },
  "theme": {
    "primaryColor": "#b8212d",
    "darkBackground": "#101a3a",
    "buttonRadius": 8
  }
}
```

---

## 5.2 types.json

타입별 데이터 파일이다.

```json
[
  {
    "id": "34A",
    "label": "34A",
    "householdCount": 156,
    "areas": {
      "exclusive": 34.99,
      "common": 15.19,
      "supply": 50.19,
      "contract": 80.50
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
  },
  {
    "id": "34B",
    "label": "34B",
    "householdCount": 120,
    "areas": {
      "exclusive": 34.80,
      "common": 15.10,
      "supply": 49.90,
      "contract": 79.20
    },
    "images": {
      "floorPlan": "/assets/floorplans/34B.png",
      "keyMap": "/assets/keymaps/34B.png"
    },
    "display": {
      "enabled": true,
      "order": 2,
      "highlight": false
    }
  }
]
```

실제 타입 목록 예시:

```txt
34A, 34B, 36, 42A, 42B1, 42B2, 42C1, 42C2, 48, 50A,
50B, 50C, 52, 54A, 54B, 55A, 55B, 57, 58A1, 58A2,
59A, 59B, 60, 61, 62, 75, 78, 79, 82, 84,
88, 89, 91, 95, 96A, 96B, 98A, 98B, 98C, 98D,
98E, 98F, 98G, 99A, 99B, 100A, 100B, 104, 105A, 105B,
105C, 106, 108, 111, 115, 118, 119A
```

---

## 5.3 CSV 관리 옵션

비개발자가 Excel에서 편집할 수 있도록 `types.csv`를 지원한다.

예시:

```csv
id,label,householdCount,exclusiveArea,commonArea,supplyArea,contractArea,floorPlan,keyMap,enabled,order,highlight
34A,34A,156,34.99,15.19,50.19,80.50,/assets/floorplans/34A.png,/assets/keymaps/34A.png,true,1,true
34B,34B,120,34.80,15.10,49.90,79.20,/assets/floorplans/34B.png,/assets/keymaps/34B.png,true,2,false
```

구현 규칙:

- 기본은 `types.json` 로드
- `site-config.json`에서 `dataSource`가 `"csv"`이면 `types.csv` 로드
- CSV 로드 시 숫자형 필드는 number로 변환
- `enabled=false`인 타입은 버튼 목록에서 숨김
- `order` 기준으로 정렬

`site-config.json`에 추가 가능한 옵션:

```json
{
  "dataSource": "json"
}
```

허용값:

```txt
json
csv
```

---

## 6. 레이아웃 설정 분리

레이아웃 변경 가능성을 고려하여 위치, 크기, 간격, 컬럼 수 등은 가능한 별도 JSON으로 분리한다.

단, 모든 CSS를 JSON으로 빼면 유지보수가 오히려 어려워진다.  
따라서 다음 정도만 설정 파일로 분리한다.

- 컨테이너 최대 너비
- 버튼 그리드 컬럼 수
- 로고 위치
- 제목 위치
- 정보 패널 위치
- 평면도 위치
- 키맵 위치
- 폰트 크기 스케일
- 배경 어둡게 처리 여부

---

## 6.1 main-layout.json

```json
{
  "backgroundOverlay": {
    "enabled": true,
    "color": "rgba(0, 0, 0, 0.20)"
  },
  "logoGroup": {
    "position": "top-right",
    "top": 48,
    "right": 72,
    "gap": 28,
    "height": 64
  },
  "hero": {
    "align": "center",
    "top": "28%",
    "titleFontSize": 64,
    "subtitleFontSize": 30
  },
  "cta": {
    "width": 320,
    "height": 88,
    "fontSize": 30,
    "top": "58%"
  }
}
```

---

## 6.2 type-list-layout.json

```json
{
  "backgroundOverlay": {
    "enabled": true,
    "color": "rgba(0, 0, 0, 0.38)"
  },
  "logoGroup": {
    "position": "top-right",
    "top": 40,
    "right": 64,
    "gap": 24,
    "height": 54
  },
  "header": {
    "titleTop": 54,
    "titleFontSize": 48,
    "subtitleFontSize": 30
  },
  "grid": {
    "top": 180,
    "maxWidth": 1024,
    "columns": 10,
    "gapX": 12,
    "gapY": 14,
    "buttonWidth": 94,
    "buttonHeight": 64,
    "buttonFontSize": 28
  },
  "backButton": {
    "top": 40,
    "left": 44
  }
}
```

---

## 6.3 type-detail-layout.json

```json
{
  "background": {
    "type": "solid",
    "color": "#232b5c"
  },
  "logoGroup": {
    "position": "top-right",
    "top": 48,
    "right": 64,
    "gap": 24,
    "height": 54
  },
  "keyMap": {
    "left": 64,
    "top": 68,
    "width": 220,
    "height": 170
  },
  "typeInfo": {
    "left": 64,
    "top": 280,
    "width": 260,
    "typeFontSize": 84,
    "labelFontSize": 22,
    "valueFontSize": 22
  },
  "floorPlan": {
    "left": "52%",
    "top": "50%",
    "maxWidth": 420,
    "maxHeight": 520
  },
  "homeButton": {
    "right": 48,
    "bottom": 36,
    "size": 54
  }
}
```

---

## 7. 라우팅 설계

React Router 기준.

```txt
/               -> MainPage
/types          -> TypeListPage
/types/:typeId  -> TypeDetailPage
```

동작:

- 메인 화면 CTA 클릭 → `/types`
- 타입 버튼 클릭 → `/types/34A`
- 상세 화면 홈 버튼 클릭 → `/`
- 타입 선택 화면 메인 버튼 클릭 → `/`
- 잘못된 typeId 접근 시 defaultTypeId 또는 `/types`로 리다이렉트

---

## 8. 컴포넌트 설계

### 8.1 App.tsx

역할:

- 라우터 연결
- 전역 설정 로드 상태 처리
- 로딩/에러 UI 처리

필수 상태:

```ts
siteConfig
unitTypes
layoutConfigs
loading
error
```

---

### 8.2 MainPage.tsx

Props:

```ts
type MainPageProps = {
  siteConfig: SiteConfig;
  layout: MainLayoutConfig;
};
```

역할:

- 메인 배경 표시
- 로고 표시
- 제목/부제 표시
- CTA 버튼 표시
- CTA 클릭 시 `/types` 이동

---

### 8.3 TypeListPage.tsx

Props:

```ts
type TypeListPageProps = {
  siteConfig: SiteConfig;
  unitTypes: UnitType[];
  layout: TypeListLayoutConfig;
};
```

역할:

- 타입 버튼 목록 표시
- `enabled=true`인 타입만 표시
- `order` 기준 정렬
- 버튼 클릭 시 `/types/:typeId` 이동
- 기본 강조 타입은 `siteConfig.defaultTypeId` 또는 `display.highlight=true`

---

### 8.4 TypeDetailPage.tsx

Props:

```ts
type TypeDetailPageProps = {
  siteConfig: SiteConfig;
  unitTypes: UnitType[];
  layout: TypeDetailLayoutConfig;
};
```

역할:

- URL의 `typeId`로 데이터 조회
- 타입 정보 표시
- 타입별 평면도 이미지 표시
- 타입별 키맵 이미지 표시
- 홈 버튼 표시

예외 처리:

- typeId가 없으면 `/types`로 이동
- typeId가 데이터에 없으면 defaultTypeId로 이동
- 이미지 로드 실패 시 대체 박스 표시

---

## 9. TypeScript 타입 정의

### 9.1 UnitType

```ts
export type UnitType = {
  id: string;
  label: string;
  householdCount: number;
  areas: {
    exclusive: number;
    common: number;
    supply: number;
    contract: number;
  };
  images: {
    floorPlan: string;
    keyMap: string;
  };
  display: {
    enabled: boolean;
    order: number;
    highlight?: boolean;
  };
};
```

### 9.2 SiteConfig

```ts
export type SiteConfig = {
  projectName: string;
  subtitle: string;
  typeListTitle: string;
  defaultTypeId: string;
  dataSource?: "json" | "csv";
  logos: {
    id: string;
    src: string;
    alt: string;
  }[];
  backgrounds: {
    main: string;
    typeList: string;
    detail?: string;
  };
  cta: {
    label: string;
    target: string;
  };
  theme: {
    primaryColor: string;
    darkBackground: string;
    buttonRadius: number;
  };
};
```

---

## 10. 데이터 검증

Zod를 사용해 JSON/CSV 로드 후 검증한다.

검증 실패 시:

- 화면에 `데이터 설정 오류` 표시
- 콘솔에 상세 오류 표시
- 어떤 파일의 어떤 필드가 문제인지 표시

필수 검증:

- `id`는 비어 있으면 안 됨
- `label`은 비어 있으면 안 됨
- 면적 값은 number여야 함
- 세대수는 number여야 함
- 이미지 경로는 string이어야 함
- `order`는 number여야 함
- 중복 id가 있으면 오류 처리

---

## 11. 이미지/에셋 관리 규칙

### 11.1 이미지 경로

모든 이미지는 `/public/assets` 아래에 둔다.

브라우저에서 접근하는 경로는 `/assets/...`로 작성한다.

예:

```json
{
  "floorPlan": "/assets/floorplans/34A.png"
}
```

### 11.2 이미지 비율

- 배경 이미지는 `object-fit: cover`
- 평면도 이미지는 `object-fit: contain`
- 키맵 이미지는 `object-fit: contain`
- 로고는 `height` 기준으로 맞추고 `width: auto`

### 11.3 이미지 누락 처리

이미지 로드 실패 시 다음 UI를 표시한다.

```txt
이미지를 불러올 수 없습니다.
파일 경로를 확인하세요.
```

---

## 12. 스타일 가이드

### 12.1 전체 화면

- 기본 해상도는 16:9 기준
- 1920x1080, 1366x768, 태블릿 가로 화면 대응
- 키오스크/홍보관 화면에서 터치 사용 가능하도록 버튼 크기 확보
- 모바일 세로 화면은 1차 필수 범위는 아님
- 단, 화면이 작아질 경우 스케일 다운되도록 구현

### 12.2 색상

기본 색상:

```css
:root {
  --color-primary: #b8212d;
  --color-primary-dark: #8f1821;
  --color-text-light: #ffffff;
  --color-text-dark: #071126;
  --color-panel-dark: #232b5c;
  --color-button-bg: rgba(255, 255, 255, 0.92);
}
```

### 12.3 버튼

타입 버튼:

- 기본 배경: 흰색 또는 반투명 흰색
- 기본 글자: 진한 남색/검정
- 선택/강조 배경: 빨간색
- 선택/강조 글자: 흰색
- border-radius 적용
- hover/active 상태 구현

---

## 13. 운영자 수정 방식

운영자가 변경할 때의 기본 흐름:

1. `public/data/types.json` 또는 `types.csv` 열기
2. 타입별 세대수/면적/이미지 경로 수정
3. 이미지가 바뀌면 `public/assets/floorplans`, `public/assets/keymaps`에 파일 추가
4. 파일명과 JSON/CSV 경로 일치 확인
5. 웹 새로고침 또는 앱 재실행

운영자를 위한 README에 반드시 포함할 내용:

- 타입 추가 방법
- 타입 삭제/숨김 방법
- 타입 순서 변경 방법
- 이미지 교체 방법
- 면적 정보 수정 방법
- CSV 사용 시 주의사항
- 오류 발생 시 확인할 항목

---

## 14. 1차 구현 범위

1차 구현에서 반드시 완료할 것:

- React + TypeScript + Vite 프로젝트 생성
- 3개 페이지 구현
  - 메인
  - 타입 선택
  - 타입 상세
- JSON 기반 데이터 로드
- 타입 목록 자동 생성
- 타입 상세 데이터 자동 반영
- 이미지 경로 기반 평면도/키맵 표시
- 레이아웃 설정 JSON 분리
- 기본 반응형 대응
- 데이터 검증
- 운영자용 README 작성

1차 구현에서 제외해도 되는 것:

- 관리자 페이지
- 로그인
- 서버 DB
- 이미지 업로드 UI
- WYSIWYG 레이아웃 편집기
- 실시간 CMS
- 다국어
- 애니메이션 고도화

---

## 15. 2차 확장 범위

필요 시 2차로 구현한다.

- CSV 편집 지원
- 관리자 페이지
- 브라우저에서 데이터 수정 후 JSON 다운로드
- Electron 빌드
- 터치 키오스크 최적화
- 타입 검색
- 타입 필터링
- 세대 타입 비교
- 확대/축소 가능한 평면도 뷰어
- 다중 프로젝트 지원
- QR 코드 공유
- 오프라인 패키징

---

## 16. Electron 빌드 요구사항

Electron은 선택 기능이다.  
웹이 먼저 정상 동작해야 하며, 그다음 Electron 빌드를 붙인다.

요구사항:

- Vite 빌드 결과물을 Electron에서 로드
- 로컬 파일 기반으로 `/assets`, `/data` 접근 가능
- Windows `.exe` 또는 설치 파일 생성 가능
- macOS `.dmg` 생성 가능
- 앱 실행 시 전체 화면 옵션 제공 가능
- 키오스크 모드 옵션 제공 가능

권장 package script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "electron:dev": "electron-vite dev",
    "electron:build": "electron-vite build && electron-builder"
  }
}
```

---

## 17. 구현 순서

Codex는 다음 순서대로 작업한다.

### Step 1. 프로젝트 생성

- Vite React TS 프로젝트 생성
- 기본 라우팅 구성
- 글로벌 CSS 구성

### Step 2. 데이터 스키마 작성

- `UnitType`
- `SiteConfig`
- 레이아웃 타입
- Zod 스키마

### Step 3. 샘플 데이터 작성

- `site-config.json`
- `types.json`
- layout JSON 3개
- 샘플 이미지 경로

### Step 4. 데이터 로더 작성

- `loadSiteConfig`
- `loadTypes`
- `loadLayoutConfig`
- 로딩/에러 처리

### Step 5. 페이지 구현

- `MainPage`
- `TypeListPage`
- `TypeDetailPage`

### Step 6. 컴포넌트 분리

- `LogoGroup`
- `TypeButtonGrid`
- `TypeInfoPanel`
- `KeyMapViewer`
- `FloorPlanViewer`
- `HomeButton`
- `BackButton`
- `BackgroundLayout`

### Step 7. 스타일링

- 첨부 이미지를 기준으로 최대한 유사한 UI 구현
- 레이아웃 JSON이 반영되도록 처리
- 반응형 스케일링

### Step 8. 검증

- 타입 클릭 → 상세 이동 확인
- 잘못된 typeId 처리 확인
- 이미지 누락 처리 확인
- JSON 오류 처리 확인
- 화면 크기 변경 확인

### Step 9. README 작성

운영자용 README와 개발자용 README를 구분해서 작성한다.

---

## 18. acceptance criteria

작업 완료 기준은 다음과 같다.

- `/` 접속 시 메인 화면이 보인다.
- CTA 버튼을 누르면 `/types`로 이동한다.
- `/types`에서 타입 버튼 그리드가 보인다.
- 타입 버튼은 `types.json`을 기준으로 자동 생성된다.
- 타입 버튼을 누르면 `/types/:typeId`로 이동한다.
- 상세 화면에서 선택한 타입의 세대수/면적/평면도/키맵이 표시된다.
- 타입 데이터를 JSON에서 수정하면 코드 수정 없이 화면이 바뀐다.
- 타입 순서를 JSON의 `order`로 바꿀 수 있다.
- `enabled=false`인 타입은 숨겨진다.
- 이미지 경로를 JSON에서 바꾸면 화면 이미지가 바뀐다.
- 레이아웃 관련 수치 일부는 layout JSON에서 수정 가능하다.
- 데이터 오류가 있을 경우 빈 화면이 아니라 명확한 오류 메시지를 표시한다.
- 빌드 명령어가 정상 동작한다.

---

## 19. Codex 작업 프롬프트

아래 프롬프트를 Codex 또는 다른 코딩 에이전트에게 그대로 전달한다.

```txt
React + TypeScript + Vite 기반으로 타입별 세대 안내 웹앱을 구현해줘.

요구사항:
1. 화면은 메인 화면, 타입 선택 화면, 타입 상세 화면 3개로 구성한다.
2. 라우팅은 /, /types, /types/:typeId 로 구성한다.
3. 타입 데이터는 public/data/types.json에서 로드한다.
4. 프로젝트 설정은 public/data/site-config.json에서 로드한다.
5. 레이아웃 설정은 public/data/layouts/*.json에서 로드한다.
6. 타입별 데이터에는 id, label, householdCount, exclusive/common/supply/contract area, floorPlan image, keyMap image, enabled, order, highlight가 포함된다.
7. 타입 목록은 enabled=true인 항목만 order 기준으로 정렬해 버튼으로 표시한다.
8. 타입 버튼 클릭 시 해당 상세 화면으로 이동한다.
9. 상세 화면에서는 URL의 typeId에 해당하는 데이터를 찾아 세대수, 전용면적, 공용면적, 공급면적, 계약면적, 평면도 이미지, 키맵 이미지를 표시한다.
10. 데이터와 레이아웃을 코드에서 최대한 분리해 유지보수가 쉽도록 구성한다.
11. Zod를 사용해 JSON 데이터를 검증하고, 오류 발생 시 사용자에게 데이터 설정 오류를 표시한다.
12. 이미지 로드 실패 시 대체 UI를 표시한다.
13. 첨부된 예시 화면과 유사하게 전체 배경 이미지, 우측 상단 로고, 큰 제목, 빨간 CTA 버튼, 타입 버튼 그리드, 상세 정보 패널을 구현한다.
14. CSS는 유지보수하기 좋게 컴포넌트 단위로 나누거나 CSS Modules/Tailwind 중 하나를 선택해 구성한다.
15. 운영자가 JSON 파일만 수정해 타입 정보와 이미지 경로를 바꿀 수 있도록 README를 작성한다.
16. Electron 빌드는 당장 필수는 아니지만, 추후 electron-vite로 확장 가능하도록 public assets/data 경로 구조를 유지한다.

프로젝트를 실제 실행 가능한 상태로 만들어줘.
```

---

## 20. 개발 시 주의사항

- 타입 데이터를 React 코드 내부 배열로 직접 박지 말 것
- 이미지 import를 남발하지 말고 public 경로 기반으로 처리할 것
- 레이아웃 수치를 전부 컴포넌트 내부에 하드코딩하지 말 것
- 단, 과도한 JSON-driven UI로 복잡도를 높이지 말 것
- 운영자가 자주 수정할 항목만 설정 파일로 분리할 것
- 처음부터 서버나 DB를 붙이지 말 것
- 1차는 정적 웹앱으로 완성할 것
- Electron은 웹 완성 후 옵션으로 붙일 것
- CSV는 JSON 버전이 안정화된 뒤 붙일 것
- 데이터 검증과 오류 메시지를 반드시 구현할 것

---

## 21. 추천 구현 판단

현재 요구사항 기준으로는 다음 구조가 가장 현실적이다.

```txt
1차: React 정적 웹앱
2차: JSON/CSV 데이터 관리 안정화
3차: Electron 오프라인 앱 빌드
4차: 관리자 편집 UI 추가
```

처음부터 관리자 페이지, DB, CMS, Electron을 모두 넣으면 개발 복잡도가 크게 증가한다.  
따라서 1차 MVP는 **React + JSON 데이터 기반 정적 웹앱**으로 구현하는 것이 가장 적절하다.
