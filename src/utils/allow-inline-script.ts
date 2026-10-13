import type { AstroGlobal } from "astro";
import { createHash } from "node:crypto";

export function allowInlineScript(astro: AstroGlobal, code: string) {
  astro.csp?.insertScriptHash(`sha256-${createHash("sha256").update(code).digest("base64")}`);
}
