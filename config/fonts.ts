import type { AstroUserConfig } from "astro";
import { datocms as datocmsFonts } from "../integrations/fonts";

type DatocmsFontFamily = NonNullable<
  AstroUserConfig<never, never, [ReturnType<typeof datocmsFonts>]>["fonts"]
>[number];

const latin = ["U+0020-007F", "U+00A0-00FF"] as const;

export const fonts = [
  {
    provider: datocmsFonts(),
    name: "Source Sans",
    cssVariable: "--font-source-sans",
    fallbacks: ["system-ui", "sans-serif"],
    featureSettings: '"kern" 1',
    unicodeRange: [...latin],
    options: {
      variants: [
        { file: "source-sans.woff2", weight: "200 900", style: "normal" },
        { file: "source-sans-italic.woff2", weight: "200 900", style: "italic" },
      ],
    },
  },
  {
    provider: datocmsFonts(),
    name: "Dash Casual",
    cssVariable: "--font-dash-casual",
    fallbacks: ["system-ui", "serif"],
    featureSettings: '"kern" 1, "liga" 1, "calt" 1, "locl" 1, "mark" 1, "mkmk" 1, "case" 1',
    unicodeRange: [...latin],
    options: {
      variants: [{ file: "dash-casual.woff2", weight: "1 700", style: "normal" }],
    },
  },
] satisfies DatocmsFontFamily[];
