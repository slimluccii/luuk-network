import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import deploybase from "@deploybase/adapter-astro";
import { generate } from "@graphql-codegen/cli";
import codegenConfig from "./codegen.config";
import codegen from "./integrations/codegen";
import site from "./integrations/site";
import designTokens from "./integrations/design-tokens";
import { env } from "./config/env";
import { security } from "./config/security";

await generate({ ...codegenConfig, silent: true });

// Imported after codegen because they import the generated documents.
const { default: icons } = await import("./integrations/icons");
const { default: translations } = await import("./integrations/translations");
const { fonts } = await import("./config/fonts");

// https://astro.build/config
export default defineConfig({
  site: "https://luuk.dk",
  adapter: deploybase(),
  integrations: [
    codegen(codegenConfig),
    site(),
    translations(),
    icons(),
    designTokens(),
    sitemap(),
  ],
  devToolbar: {
    enabled: false,
  },
  prefetch: true,
  markdown: {
    syntaxHighlight: false,
  },
  security,
  fonts,
  env,
});
