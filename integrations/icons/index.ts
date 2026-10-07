import type { AstroIntegration } from "astro";
import { IconsDocument } from "~/generated/datocms";
import SVGSpriter from "svg-sprite";
import { optimize, type Config } from "svgo";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { executeQuery } from "../datocms";

const svgoConfig: Config = {
  plugins: [
    {
      name: "preset-default",
      params: { overrides: { inlineStyles: { onlyMatchedOnce: false } } },
    },
    // A <style> left in an inlined sprite applies to the whole page.
    "removeStyleElement",
  ],
};

export default function icons(): AstroIntegration {
  return {
    name: "icons",
    hooks: {
      "astro:config:setup": async ({ config, logger }) => {
        const { allIcons } = await executeQuery(IconsDocument);

        const spriter = new SVGSpriter({
          mode: {
            symbol: true,
          },
        });

        await Promise.all(
          allIcons.map(async ({ file, name }) => {
            if (!file) return;
            const svgContent = await (await fetch(file.url)).text();
            spriter.add(`${name}.svg`, null, optimize(svgContent, svgoConfig).data);
          }),
        );

        const { result } = await spriter.compileAsync();

        const outputDir = join(config.root.pathname, ".generated");
        const names = allIcons.map(({ name }) => `'${name}'`);

        await mkdir(outputDir, { recursive: true });
        await writeFile(join(outputDir, "icon-sprite.svg"), result.symbol.sprite.contents);
        await writeFile(
          join(outputDir, "icon-sprite.ts"),
          `export type IconName = ${names.join(" | ") || "never"}`,
        );

        logger.info("Generated");
      },
    },
  };
}
