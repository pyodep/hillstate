import type { BackgroundOverlay } from "../types/layout";
import { clientAssetPath } from "../utils/publicPath";

type BackgroundLayoutProps = {
  image?: string;
  overlay?: BackgroundOverlay;
  className?: string;
  children: React.ReactNode;
};

export function BackgroundLayout({ image, overlay, className = "", children }: BackgroundLayoutProps) {
  return (
    <main className={`screen screen--image ${className}`}>
      {image ? <img className="screen__background" src={clientAssetPath(image)} alt="" aria-hidden="true" /> : null}
      {overlay?.enabled ? <div className="screen__overlay" style={{ background: overlay.color }} /> : null}
      <div className="screen__content">{children}</div>
    </main>
  );
}
