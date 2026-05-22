export type UnitType = {
  id: string;
  label: string;
  householdCount: number;
  areas: {
    exclusive: number;
    common: number;
    supply: number;
    contract: number;
  };
  images: {
    floorPlan: string;
    keyMap: string;
  };
  roomLabels?: {
    text: string;
    x: number;
    y: number;
    fontSize?: number;
  }[];
  display: {
    enabled: boolean;
    order: number;
    highlight?: boolean;
  };
};
