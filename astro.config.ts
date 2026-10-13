import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import deploybase from "@deploybase/adapter-astro";
import { generate } from "@graphql-codegen/cli";
import codegenConfig from "./codegen.config";
import codegen from "./integrations/codegen";
import site from "./integrations/site";
import designTokens from "./integrations/design-tokens";

await generate({ ...codegenConfig, silent: true });

// Imported after codegen because they import the generated documents.
const { default: icons } = await import("./integrations/icons");
const { default: translations } = await import("./integrations/translations");
const { datocms: datocmsFonts } = await import("./integrations/fonts");

const latin = ["U+0020-007F", "U+00A0-00FF"] as const;

// https://astro.build/config
export default defineConfig({
  site: "https://luuk.network",
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
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://www.datocms-assets.com",
        "font-src 'self'",
        "connect-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-src https://*.frcapi.com",
        "object-src 'none'",
        "require-trusted-types-for 'script'",
        "trusted-types 'none'",
      ],
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  fonts: [
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
  ],
  env: {
    schema: {
      DATOCMS_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      LETTERMINT_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_SENDER: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_RECIPIENT: envField.string({
        context: "server",
        access: "secret",
      }),
      CONTACT_FORM_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      FRIENDLY_CAPTCHA_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      FRIENDLY_CAPTCHA_SITEKEY: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
});
