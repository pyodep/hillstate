import { ChevronLeft, Home } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { LogoGroup } from "../components/LogoGroup";
import type { TypeDetailLayoutConfig } from "../types/layout";
import type { SiteConfig } from "../types/site";
import type { UnitType } from "../types/unit";
import { formatArea } from "../utils/formatArea";

type TypeDetailPageProps = {
  siteConfig: SiteConfig;
  unitTypes: UnitType[];
  layout: TypeDetailLayoutConfig;
};

const areaRows = [
  ["세대수", "householdCount"],
  ["전용면적", "exclusive"],
  ["공용면적", "common"],
  ["공급면적", "supply"],
  ["계약면적", "contract"],
] as const;

export function TypeDetailPage({ siteConfig, unitTypes, layout }: TypeDetailPageProps) {
  const { typeId } = useParams();
  const unitType = unitTypes.find((type) => type.id === typeId);

  if (!typeId) {
    return <Navigate to="/types" replace />;
  }

  if (!unitType) {
    return <Navigate to={`/types/${siteConfig.defaultTypeId}`} replace />;
  }

  return (
    <main className="screen detail-page" style={{ background: layout.background.color }}>
      <LogoGroup logos={siteConfig.logos} layout={layout.logoGroup} compact />
      <section
        className="keymap-panel"
        style={
          {
            "--keymap-left": `${layout.keyMap.left}px`,
            "--keymap-top": `${layout.keyMap.top}px`,
            "--keymap-width": `${layout.keyMap.width}px`,
            "--keymap-height": `${layout.keyMap.height}px`,
          } as React.CSSProperties
        }
      >
        <h2>KEY MAP</h2>
        <ImageWithFallback src={unitType.images.keyMap} alt={`${unitType.label} 키맵`} className="keymap-image" fallbackTitle="키맵 준비 중" />
      </section>
      <section
        className="type-info"
        style={
          {
            "--info-left": `${layout.typeInfo.left}px`,
            "--info-top": `${layout.typeInfo.top}px`,
            "--info-width": `${layout.typeInfo.width}px`,
            "--type-font-size": `${layout.typeInfo.typeFontSize}px`,
            "--label-font-size": `${layout.typeInfo.labelFontSize}px`,
            "--value-font-size": `${layout.typeInfo.valueFontSize}px`,
          } as React.CSSProperties
        }
      >
        <h1>{unitType.label}</h1>
        <dl>
          {areaRows.map(([label, key]) => {
            const value = key === "householdCount" ? `${unitType.householdCount}세대` : `${formatArea(unitType.areas[key])}㎡`;
            return (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            );
          })}
        </dl>
      </section>
      <section
        className="floorplan-panel"
        style={
          {
            "--floorplan-left": layout.floorPlan.left,
            "--floorplan-top": layout.floorPlan.top,
            "--floorplan-max-width": `${layout.floorPlan.maxWidth}px`,
            "--floorplan-max-height": `${layout.floorPlan.maxHeight}px`,
          } as React.CSSProperties
        }
      >
        <ImageWithFallback
          src={unitType.images.floorPlan}
          alt={`${unitType.label} 평면도`}
          className="floorplan-image"
          fallbackTitle="평면도 준비 중"
        />
      </section>
      <Link
        className="detail-back-link"
        to="/types"
        aria-label="타입 선택으로 돌아가기"
        title="타입 선택으로 돌아가기"
        style={
          {
            "--home-right": `${layout.homeButton.right}px`,
            "--home-bottom": `${layout.homeButton.bottom}px`,
            "--home-size": `${layout.homeButton.size}px`,
          } as React.CSSProperties
        }
      >
        <ChevronLeft aria-hidden="true" size={34} strokeWidth={2.6} />
      </Link>
      <Link
        className="home-link"
        to="/"
        aria-label="메인으로 이동"
        title="메인으로 이동"
        style={
          {
            "--home-right": `${layout.homeButton.right}px`,
            "--home-bottom": `${layout.homeButton.bottom}px`,
            "--home-size": `${layout.homeButton.size}px`,
          } as React.CSSProperties
        }
      >
        <Home aria-hidden="true" size={30} strokeWidth={2.4} />
      </Link>
    </main>
  );
}
