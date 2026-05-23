import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BackgroundLayout } from "../components/BackgroundLayout";
import { LogoGroup } from "../components/LogoGroup";
import type { MainLayoutConfig } from "../types/layout";
import type { SiteConfig } from "../types/site";

type MainPageProps = {
  siteConfig: SiteConfig;
  layout: MainLayoutConfig;
};

export function MainPage({ siteConfig, layout }: MainPageProps) {
  return (
    <BackgroundLayout image={siteConfig.backgrounds.main} overlay={layout.backgroundOverlay} className="main-page">
      <LogoGroup logos={siteConfig.logos} layout={layout.logoGroup} />
      <section
        className="main-hero"
        style={
          {
            "--hero-top": layout.hero.top,
            "--hero-title-size": `${layout.hero.titleFontSize}px`,
            "--hero-subtitle-size": `${layout.hero.subtitleFontSize}px`,
          } as React.CSSProperties
        }
      >
        <p>{siteConfig.subtitle}</p>
        <h1>{siteConfig.projectName}</h1>
      </section>
      <Link
        to={siteConfig.cta.target}
        className="main-cta"
        style={
          {
            "--cta-top": layout.cta.top,
            "--cta-width": `${layout.cta.width}px`,
            "--cta-height": `${layout.cta.height}px`,
            "--cta-font-size": `${layout.cta.fontSize}px`,
            "--button-radius": `${siteConfig.theme.buttonRadius}px`,
          } as React.CSSProperties
        }
      >
        <span>{siteConfig.cta.label}</span>
        <ChevronRight aria-hidden="true" size={38} strokeWidth={2.8} />
      </Link>
    </BackgroundLayout>
  );
}
