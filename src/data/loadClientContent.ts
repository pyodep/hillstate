import Papa from "papaparse";
import {
  MainLayoutSchema,
  SiteConfigSchema,
  TypeDetailLayoutSchema,
  TypeListLayoutSchema,
  UnitTypesSchema,
} from "./schemas";
import type { MainLayoutConfig, TypeDetailLayoutConfig, TypeListLayoutConfig } from "../types/layout";
import type { SiteConfig } from "../types/site";
import type { UnitType } from "../types/unit";
import { clientContentPath } from "../utils/publicPath";

const clientFiles = {
  site: "site.json",
  typesJson: "datasets/unit-types.json",
  typesCsv: "datasets/unit-types.csv",
  layouts: {
    main: "layouts/main.json",
    typeList: "layouts/type-list.json",
    typeDetail: "layouts/type-detail.json",
  },
} as const;

export type ClientContentData = {
  siteConfig: SiteConfig;
  unitTypes: UnitType[];
  layouts: {
    main: MainLayoutConfig;
    typeList: TypeListLayoutConfig;
    typeDetail: TypeDetailLayoutConfig;
  };
};

async function fetchJson(path: string, label: string) {
  const url = clientContentPath(path);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} 파일을 불러오지 못했습니다. (${response.status}) 경로: ${url}`);
  }
  return response.json();
}

async function fetchText(path: string, label: string) {
  const url = clientContentPath(path);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} 파일을 불러오지 못했습니다. (${response.status}) 경로: ${url}`);
  }
  return response.text();
}

function toNumber(value: unknown, field: string, typeId: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${typeId} 타입의 ${field} 값이 숫자가 아닙니다.`);
  }
  return parsed;
}

function toBoolean(value: unknown) {
  return String(value).toLowerCase() === "true";
}

function toOptionalImageSize(width: unknown, height: unknown) {
  const parsedWidth = Number(width);
  const parsedHeight = Number(height);
  if (!Number.isFinite(parsedWidth) || !Number.isFinite(parsedHeight) || parsedWidth <= 0 || parsedHeight <= 0) {
    return undefined;
  }
  return {
    width: parsedWidth,
    height: parsedHeight,
  };
}

function parseCsvTypes(csvText: string): UnitType[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`types.csv 파싱 오류: ${parsed.errors[0].message}`);
  }

  return parsed.data.map((row) => {
    const id = row.id?.trim();
    return {
      id,
      label: row.label?.trim() || id,
      householdCount: toNumber(row.householdCount, "세대수", id),
      areas: {
        exclusive: toNumber(row.exclusiveArea, "전용면적", id),
        common: toNumber(row.commonArea, "공용면적", id),
        supply: toNumber(row.supplyArea, "공급면적", id),
        contract: toNumber(row.contractArea, "계약면적", id),
      },
      images: {
        floorPlan: row.floorPlan?.trim() || "",
        floorPlanSize: toOptionalImageSize(row.floorPlanWidth, row.floorPlanHeight),
        keyMap: row.keyMap?.trim() || "",
      },
      display: {
        enabled: toBoolean(row.enabled),
        order: toNumber(row.order, "순서", id),
        highlight: toBoolean(row.highlight),
      },
    };
  });
}

function assertUniqueTypeIds(unitTypes: UnitType[]) {
  const seen = new Set<string>();
  for (const unitType of unitTypes) {
    if (seen.has(unitType.id)) {
      throw new Error(`중복 타입 ID가 있습니다: ${unitType.id}`);
    }
    seen.add(unitType.id);
  }
}

export async function loadClientContent(): Promise<ClientContentData> {
  const siteConfig = SiteConfigSchema.parse(await fetchJson(clientFiles.site, clientFiles.site));
  const [mainLayout, typeListLayout, typeDetailLayout] = await Promise.all([
    fetchJson(clientFiles.layouts.main, clientFiles.layouts.main),
    fetchJson(clientFiles.layouts.typeList, clientFiles.layouts.typeList),
    fetchJson(clientFiles.layouts.typeDetail, clientFiles.layouts.typeDetail),
  ]);

  const unitTypes =
    siteConfig.dataSource === "csv"
      ? UnitTypesSchema.parse(parseCsvTypes(await fetchText(clientFiles.typesCsv, clientFiles.typesCsv)))
      : UnitTypesSchema.parse(await fetchJson(clientFiles.typesJson, clientFiles.typesJson));

  assertUniqueTypeIds(unitTypes);

  return {
    siteConfig,
    unitTypes: [...unitTypes].sort((a, b) => a.display.order - b.display.order),
    layouts: {
      main: MainLayoutSchema.parse(mainLayout),
      typeList: TypeListLayoutSchema.parse(typeListLayout),
      typeDetail: TypeDetailLayoutSchema.parse(typeDetailLayout),
    },
  };
}
