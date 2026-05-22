# 클라이언트 수정 안내

이 폴더는 운영자가 직접 수정하는 영역입니다. 코드 파일을 건드리지 않고도 문구, 타입 데이터, 이미지, 레이아웃 값을 바꿀 수 있습니다.

## 자주 수정하는 파일

- `site.json`: 프로젝트명, 메인 문구, 버튼 문구, 로고, 상세 화면 전용 로고, 배경, 기본 선택 타입, 색상
- `datasets/unit-types.json`: 타입 목록, 세대수, 면적, 평면도, 키맵 연결, 평면도 위 방 이름 라벨
- `datasets/unit-types.csv`: Excel에서 편집하기 쉬운 타입 데이터
- `layouts/*.json`: 화면별 위치, 크기, 간격

## 이미지 폴더

- `backgrounds`: 메인/타입 선택 배경
- `logos`: 상단 로고
- `floorplans`: 타입별 평면도
- `keymaps`: 타입별 키맵

## 이미지 경로 쓰는 법

경로는 이 `public/client` 폴더를 기준으로 씁니다.

```json
{
  "floorPlan": "floorplans/34A.png",
  "keyMap": "keymaps/34A.png"
}
```

예를 들어 `floorplans/59A.png` 파일을 추가했다면 `unit-types.json`에는 `"floorPlan": "floorplans/59A.png"`라고 적습니다.

## 평면도 위 방 이름 라벨

`unit-types.json`에서 타입별로 `roomLabels`를 추가하면 평면도 위에 방 이름을 표시합니다. `x`, `y`는 평면도 이미지 기준 퍼센트 위치입니다.

```json
{
  "roomLabels": [
    {
      "text": "거실/침실",
      "x": 55,
      "y": 35,
      "fontSize": 13
    }
  ]
}
```

## CSV 사용

`site.json`에서 아래 값을 바꾸면 앱이 `datasets/unit-types.csv`를 읽습니다.

```json
{
  "dataSource": "csv"
}
```

기본값은 `"json"`입니다.

## GitHub에서 직접 수정할 때

1. GitHub 저장소에서 `public/client` 폴더로 이동합니다.
2. JSON/CSV 파일은 연필 버튼으로 수정합니다.
3. 이미지는 해당 폴더에 Upload files로 추가하거나 같은 이름으로 교체합니다.
4. 변경사항을 commit하면 GitHub Pages 배포가 자동으로 다시 실행됩니다.
