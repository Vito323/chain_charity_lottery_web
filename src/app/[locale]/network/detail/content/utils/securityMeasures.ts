import { useTranslations } from "next-intl";

export interface SecurityMeasure {
  id: number;
  title: string;
  icon: string;
  items: string[];
}

export const getSecurityMeasures = (t: ReturnType<typeof useTranslations>): SecurityMeasure[] => {
  return [
    {
      id: 1,
      title: t("security.protection.title"),
      icon: "ti-pulse",
      items: [
        t("security.protection.item1"),
        t("security.protection.item2"),
        t("security.protection.item3"),
        t("security.protection.item4"),
      ],
    },
    {
      id: 2,
      title: t("security.technical.title"),
      icon: "ti-lock",
      items: [
        t("security.technical.item1"),
        t("security.technical.item2"),
        t("security.technical.item3"),
        t("security.technical.item4"),
      ],
    },
    {
      id: 3,
      title: t("security.transparency.title"),
      icon: "ti-bar-chart",
      items: [
        t("security.transparency.item1"),
        t("security.transparency.item2"),
        t("security.transparency.item3"),
        t("security.transparency.item4"),
      ],
    },
    {
      id: 4,
      title: t("security.insurance.title"),
      icon: "ti-shield",
      items: [
        t("security.insurance.item1"),
        t("security.insurance.item2"),
        t("security.insurance.item3"),
        t("security.insurance.item4"),
      ],
    },
  ];
};

