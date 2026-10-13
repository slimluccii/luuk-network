import type { AstroUserConfig } from "astro";
import { envField } from "astro/config";

export const env = {
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
} satisfies AstroUserConfig["env"];
