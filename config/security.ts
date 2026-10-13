import type { AstroUserConfig } from "astro";
import { createHash } from "node:crypto";
import { globSync, readFileSync } from "node:fs";

// Astro does not hash is:inline scripts, so on-demand pages, which get the CSP as a header, would block them
const inlineScriptHashes = globSync("src/**/*.astro").flatMap((file) =>
  [...readFileSync(file, "utf8").matchAll(/<script is:inline\b[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, code]) => `sha256-${createHash("sha256").update(code).digest("base64")}` as const,
  ),
);

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
    scriptDirective: {
      resources: ["'self'", "'wasm-unsafe-eval'"],
      hashes: inlineScriptHashes,
    },
    styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
  },
} satisfies AstroUserConfig["security"];
