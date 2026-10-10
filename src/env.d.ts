// The package ships no type declarations.
declare module "@deploybase/adapter-astro" {
  import type { AstroIntegration } from "astro";

  export default function deploybase(options?: { external?: string[] }): AstroIntegration;
}
