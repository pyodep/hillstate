import type { LogoGroupLayout } from "../types/layout";
import type { SiteConfig } from "../types/site";
import { clientAssetPath } from "../utils/publicPath";

type LogoGroupProps = {
  logos: SiteConfig["logos"];
  layout: LogoGroupLayout;
  compact?: boolean;
};

export function LogoGroup({ logos, layout, compact = false }: LogoGroupProps) {
  return (
    <div
      className={`logo-group ${compact ? "logo-group--compact" : ""}`}
      style={
        {
          "--logo-top": `${layout.top}px`,
          "--logo-right": `${layout.right}px`,
          "--logo-gap": `${layout.gap}px`,
          "--logo-height": `${layout.height}px`,
        } as React.CSSProperties
      }
    >
      {logos.map((logo) => (
        <img key={logo.id} src={clientAssetPath(logo.src)} alt={logo.alt} />
      ))}
    </div>
  );
}
