import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BackgroundLayout } from "../components/BackgroundLayout";
import { LogoGroup } from "../components/LogoGroup";
import type { TypeListLayoutConfig } from "../types/layout";
import type { SiteConfig } from "../types/site";
import type { UnitType } from "../types/unit";

type TypeListPageProps = {
  siteConfig: SiteConfig;
  unitTypes: UnitType[];
  layout: TypeListLayoutConfig;
};

export function TypeListPage({ siteConfig, unitTypes, layout }: TypeListPageProps) {
  const visibleTypes = unitTypes.filter((type) => type.display.enabled);

  return (
    <BackgroundLayout image={siteConfig.backgrounds.typeList} overlay={layout.backgroundOverlay} className="type-list-page">
      <Link
        className="back-link"
        to="/"
        style={
          {
            "--back-top": `${layout.backButton.top}px`,
            "--back-left": `${layout.backButton.left}px`,
          } as React.CSSProperties
        }
      >
        <ChevronLeft aria-hidden="true" size={42} strokeWidth={2.5} />
        <span>메인</span>
      </Link>
      <LogoGroup logos={siteConfig.logos} layout={layout.logoGroup} compact />
      <header
        className="type-list-header"
        style={
          {
            "--list-title-top": `${layout.header.titleTop}px`,
            "--list-title-size": `${layout.header.titleFontSize}px`,
            "--list-subtitle-size": `${layout.header.subtitleFontSize}px`,
          } as React.CSSProperties
        }
      >
        <h1>{siteConfig.projectName}</h1>
        <p>{siteConfig.typeListTitle}</p>
      </header>
      <nav
        className="type-grid"
        aria-label="세대 타입 선택"
        style={
          {
            "--grid-top": `${layout.grid.top}px`,
            "--grid-max-width": `${layout.grid.maxWidth}px`,
            "--grid-columns": layout.grid.columns,
            "--grid-gap-x": `${layout.grid.gapX}px`,
            "--grid-gap-y": `${layout.grid.gapY}px`,
            "--type-button-width": `${layout.grid.buttonWidth}px`,
            "--type-button-height": `${layout.grid.buttonHeight}px`,
            "--type-button-font-size": `${layout.grid.buttonFontSize}px`,
            "--button-radius": `${siteConfig.theme.buttonRadius}px`,
          } as React.CSSProperties
        }
      >
        {visibleTypes.map((unitType) => (
          <Link key={unitType.id} to={`/types/${unitType.id}`} className="type-button">
            {unitType.label}
          </Link>
        ))}
      </nav>
    </BackgroundLayout>
  );
}
