export type SiteConfig = {
  projectName: string;
  subtitle: string;
  typeListTitle: string;
  defaultTypeId: string;
  dataSource?: "json" | "csv";
  logos: {
    id: string;
    src: string;
    alt: string;
  }[];
  backgrounds: {
    main: string;
    typeList: string;
    detail?: string;
  };
  cta: {
    label: string;
    target: string;
  };
  theme: {
    primaryColor: string;
    darkBackground: string;
    buttonRadius: number;
  };
};
