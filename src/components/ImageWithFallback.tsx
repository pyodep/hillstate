import { useState, type CSSProperties } from "react";
import { clientAssetPath } from "../utils/publicPath";

type ImageWithFallbackProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  height?: number;
  style?: CSSProperties;
  width?: number;
};

export function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackTitle = "이미지를 불러올 수 없습니다.",
  height,
  style,
  width,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={fallbackTitle}>
        <strong>{fallbackTitle}</strong>
        <span>{src ? "파일 경로를 확인하세요." : "파일 경로를 추가하세요."}</span>
      </div>
    );
  }

  return (
    <img
      key={src}
      className={className}
      src={clientAssetPath(src)}
      alt={alt}
      width={width}
      height={height}
      style={style}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
