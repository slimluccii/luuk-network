import type { AstroIntegration } from "astro";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { executeQuery } from "../datocms";
import { SiteLocale, TranslationsDocument } from "~/generated/datocms";

export default function translations(): AstroIntegration {
  return {
    name: "translations",
    hooks: {
      "astro:config:setup": async ({ config, logger }) => {
        const locales = Object.values(SiteLocale);
        const results = await Promise.all(
          locales.map((locale) => executeQuery(TranslationsDocument, { locale })),
        );

        const byLocale = Object.fromEntries(
          results.map(({ allTranslations }, index) => [
            locales[index],
            Object.fromEntries(
              allTranslations.flatMap(({ key, value }) => (key ? [[key, value ?? ""]] : [])),
            ),
          ]),
        );

        const outputDir = join(config.root.pathname, ".generated");

        await mkdir(outputDir, { recursive: true });
        await writeFile(join(outputDir, "translations.json"), JSON.stringify(byLocale, null, 2));

        logger.info("Generated");
      },
    },
  };
}
