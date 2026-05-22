import { z } from "zod";

export const SiteConfigSchema = z.object({
  projectName: z.string().min(1),
  subtitle: z.string().min(1),
  typeListTitle: z.string().min(1),
  defaultTypeId: z.string().min(1),
  dataSource: z.enum(["json", "csv"]).optional(),
  logos: z.array(
    z.object({
      id: z.string().min(1),
      src: z.string().min(1),
      alt: z.string().min(1),
    }),
  ),
  detailLogos: z
    .array(
      z.object({
        id: z.string().min(1),
        src: z.string().min(1),
        alt: z.string().min(1),
      }),
    )
    .optional(),
  backgrounds: z.object({
    main: z.string().min(1),
    typeList: z.string().min(1),
    detail: z.string().optional(),
  }),
  cta: z.object({
    label: z.string().min(1),
    target: z.string().min(1),
  }),
  theme: z.object({
    primaryColor: z.string().min(1),
    darkBackground: z.string().min(1),
    buttonRadius: z.number(),
  }),
});

export const UnitTypeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  householdCount: z.number(),
  areas: z.object({
    exclusive: z.number(),
    common: z.number(),
    supply: z.number(),
    contract: z.number(),
  }),
  images: z.object({
    floorPlan: z.string(),
    keyMap: z.string(),
  }),
  roomLabels: z
    .array(
      z.object({
        text: z.string().min(1),
        x: z.number(),
        y: z.number(),
        fontSize: z.number().optional(),
      }),
    )
    .optional(),
  display: z.object({
    enabled: z.boolean(),
    order: z.number(),
    highlight: z.boolean().optional(),
  }),
});

export const UnitTypesSchema = z.array(UnitTypeSchema);

const logoGroupSchema = z.object({
  position: z.literal("top-right"),
  top: z.number(),
  right: z.number(),
  gap: z.number(),
  height: z.number(),
});

const backgroundOverlaySchema = z.object({
  enabled: z.boolean(),
  color: z.string(),
});

export const MainLayoutSchema = z.object({
  backgroundOverlay: backgroundOverlaySchema,
  logoGroup: logoGroupSchema,
  hero: z.object({
    align: z.literal("center"),
    top: z.string(),
    titleFontSize: z.number(),
    subtitleFontSize: z.number(),
  }),
  cta: z.object({
    width: z.number(),
    height: z.number(),
    fontSize: z.number(),
    top: z.string(),
  }),
});

export const TypeListLayoutSchema = z.object({
  backgroundOverlay: backgroundOverlaySchema,
  logoGroup: logoGroupSchema,
  header: z.object({
    titleTop: z.number(),
    titleFontSize: z.number(),
    subtitleFontSize: z.number(),
  }),
  grid: z.object({
    top: z.number(),
    maxWidth: z.number(),
    columns: z.number(),
    gapX: z.number(),
    gapY: z.number(),
    buttonWidth: z.number(),
    buttonHeight: z.number(),
    buttonFontSize: z.number(),
  }),
  backButton: z.object({
    top: z.number(),
    left: z.number(),
  }),
});

export const TypeDetailLayoutSchema = z.object({
  background: z.object({
    type: z.literal("solid"),
    color: z.string(),
  }),
  logoGroup: logoGroupSchema,
  keyMap: z.object({
    left: z.number(),
    top: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  typeInfo: z.object({
    left: z.number(),
    top: z.number(),
    width: z.number(),
    typeFontSize: z.number(),
    labelFontSize: z.number(),
    valueFontSize: z.number(),
  }),
  floorPlan: z.object({
    left: z.string(),
    top: z.string(),
    maxWidth: z.number(),
    maxHeight: z.number(),
  }),
  homeButton: z.object({
    right: z.number(),
    bottom: z.number(),
    size: z.number(),
  }),
});
