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
    floorPlanSize?: {
      width: number;
      height: number;
    };
    keyMap: string;
  };
  display: {
    enabled: boolean;
    order: number;
    highlight?: boolean;
  };
};
