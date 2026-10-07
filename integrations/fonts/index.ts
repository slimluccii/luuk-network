import type { FontProvider } from "astro";
import { FontsDocument } from "~/generated/datocms";
import { executeQuery } from "../datocms";

type Variant = {
  file: string;
  weight: string;
  style: "normal" | "italic";
};

type FamilyOptions = {
  variants: [Variant, ...Variant[]];
};

/** Serves font files uploaded to the DatoCMS media library, matched by filename. */
export function datocms(): FontProvider<FamilyOptions> {
  let urlByFilename = new Map<string, string>();

  return {
    name: "datocms",
    async init() {
      const { allUploads } = await executeQuery(FontsDocument);
      urlByFilename = new Map(allUploads.map(({ filename, url }) => [filename, url]));
    },
    resolveFont({ familyName, styles, options }) {
      const variants = options?.variants.filter(({ style }) => styles.includes(style)) ?? [];

      return {
        fonts: variants.map(({ file, weight, style }) => {
          const url = urlByFilename.get(file);
          if (!url) throw new Error(`No font file "${file}" for ${familyName} in DatoCMS`);
          return { src: [{ url }], weight, style };
        }),
      };
    },
  };
}
