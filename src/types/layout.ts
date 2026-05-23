export type LogoGroupLayout = {
  position: "top-right";
  top: number;
  right: number;
  gap: number;
  height: number;
};

export type BackgroundOverlay = {
  enabled: boolean;
  color: string;
};

export type MainLayoutConfig = {
  backgroundOverlay: BackgroundOverlay;
  logoGroup: LogoGroupLayout;
  hero: {
    align: "center";
    top: string;
    titleFontSize: number;
    subtitleFontSize: number;
  };
  cta: {
    width: number;
    height: number;
    fontSize: number;
    top: string;
  };
};

export type TypeListLayoutConfig = {
  backgroundOverlay: BackgroundOverlay;
  logoGroup: LogoGroupLayout;
  header: {
    titleTop: number;
    titleFontSize: number;
    subtitleFontSize: number;
  };
  grid: {
    top: number;
    maxWidth: number;
    columns: number;
    gapX: number;
    gapY: number;
    buttonWidth: number;
    buttonHeight: number;
    buttonFontSize: number;
  };
  backButton: {
    top: number;
    left: number;
  };
};

export type TypeDetailLayoutConfig = {
  background: {
    type: "solid";
    color: string;
  };
  logoGroup: LogoGroupLayout;
  keyMap: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  typeInfo: {
    left: number;
    top: number;
    width: number;
    typeFontSize: number;
    labelFontSize: number;
    valueFontSize: number;
  };
  floorPlan: {
    left: string;
    top: string;
    maxWidth: number;
    maxHeight: number;
    sourceScale?: number;
  };
  homeButton: {
    right: number;
    bottom: number;
    size: number;
  };
};
