import { useState } from "react";
import { clientAssetPath } from "../utils/publicPath";

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
};

export function ImageWithFallback({ src, alt, className = "", fallbackTitle = "이미지를 불러올 수 없습니다." }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={fallbackTitle}>
        <strong>{fallbackTitle}</strong>
        <span>{src ? "파일 경로를 확인하세요." : "파일 경로를 추가하세요."}</span>
      </div>
    );
  }

  return <img className={className} src={clientAssetPath(src)} alt={alt} onError={() => setFailed(true)} />;
}
