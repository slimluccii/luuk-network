import type { AstroUserConfig } from "astro";

export const security = {
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
} satisfies AstroUserConfig["security"];
