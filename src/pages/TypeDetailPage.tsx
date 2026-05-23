import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { LogoGroup } from "../components/LogoGroup";
import type { TypeDetailLayoutConfig } from "../types/layout";
import type { SiteConfig } from "../types/site";
import type { UnitType } from "../types/unit";
import { formatArea } from "../utils/formatArea";
import { clientAssetPath } from "../utils/publicPath";

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
  const visibleTypes = unitTypes.filter((type) => type.display.enabled);

  if (!typeId) {
    return <Navigate to="/types" replace />;
  }

  if (!unitType) {
    return <Navigate to={`/types/${siteConfig.defaultTypeId}`} replace />;
  }

  const currentTypeIndex = visibleTypes.findIndex((type) => type.id === unitType.id);
  const hasTypeSwitch = visibleTypes.length > 1 && currentTypeIndex >= 0;
  const previousType = hasTypeSwitch ? visibleTypes[(currentTypeIndex - 1 + visibleTypes.length) % visibleTypes.length] : undefined;
  const nextType = hasTypeSwitch ? visibleTypes[(currentTypeIndex + 1) % visibleTypes.length] : undefined;
  const floorPlanSourceSize = unitType.images.floorPlanSize ?? { width: 1500, height: 2500 };
  const floorPlanSourceScale = layout.floorPlan.sourceScale ?? 0.16;
  const floorPlanScale = Math.min(
    floorPlanSourceScale,
    layout.floorPlan.maxWidth / floorPlanSourceSize.width,
    layout.floorPlan.maxHeight / floorPlanSourceSize.height,
  );
  const floorPlanDisplaySize = {
    width: Math.round(floorPlanSourceSize.width * floorPlanScale),
    height: Math.round(floorPlanSourceSize.height * floorPlanScale),
  };
  const typeSwitchLeft = layout.typeInfo.left + layout.typeInfo.width + 38;

  return (
    <main
      className="screen detail-page"
      style={
        {
          background: layout.background.color,
          "--type-switch-left": `${typeSwitchLeft}px`,
          "--type-switch-right": "76px",
        } as React.CSSProperties
      }
    >
      <LogoGroup logos={siteConfig.detailLogos ?? siteConfig.logos} layout={layout.logoGroup} compact />
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
            "--floorplan-render-width": `${floorPlanDisplaySize.width}px`,
            "--floorplan-render-height": `${floorPlanDisplaySize.height}px`,
          } as React.CSSProperties
        }
      >
        <div className="floorplan-stage">
          <ImageWithFallback
            src={unitType.images.floorPlan}
            alt={`${unitType.label} 평면도`}
            className="floorplan-image"
            fallbackTitle="평면도 준비 중"
            width={floorPlanSourceSize.width}
            height={floorPlanSourceSize.height}
          />
        </div>
      </section>
      {previousType ? (
        <Link
          className="type-switch-link type-switch-prev"
          to={`/types/${previousType.id}`}
          aria-label={`${previousType.label} 타입으로 이동`}
          title={`${previousType.label} 타입으로 이동`}
        >
          <ChevronLeft aria-hidden="true" size={54} strokeWidth={2.3} />
        </Link>
      ) : null}
      {nextType ? (
        <Link
          className="type-switch-link type-switch-next"
          to={`/types/${nextType.id}`}
          aria-label={`${nextType.label} 타입으로 이동`}
          title={`${nextType.label} 타입으로 이동`}
        >
          <ChevronRight aria-hidden="true" size={54} strokeWidth={2.3} />
        </Link>
      ) : null}
      {previousType?.images.floorPlan ? <img className="floorplan-preload" src={clientAssetPath(previousType.images.floorPlan)} alt="" aria-hidden="true" /> : null}
      {nextType?.images.floorPlan ? <img className="floorplan-preload" src={clientAssetPath(nextType.images.floorPlan)} alt="" aria-hidden="true" /> : null}
      <Link
        className="type-list-return-link"
        to="/types"
        aria-label="타입별 세대 안내로 돌아가기"
        title="타입별 세대 안내로 돌아가기"
        style={
          {
            "--home-right": `${layout.homeButton.right}px`,
            "--home-bottom": `${layout.homeButton.bottom}px`,
            "--home-size": `${layout.homeButton.size}px`,
          } as React.CSSProperties
        }
      >
        <ChevronLeft aria-hidden="true" size={48} strokeWidth={2.6} />
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
        <Home aria-hidden="true" size={42} fill="currentColor" strokeWidth={0} />
      </Link>
    </main>
  );
}
