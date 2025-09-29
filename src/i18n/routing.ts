import { defineRouting } from "next-intl/routing";

export const LNG_LIST = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "简体中文",
    value: "zh",
  },
];
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LNG_LIST.map(item => item.value),
 
  // Used when no locale matches

  defaultLocale: 'en',

  localePrefix: "never",
});