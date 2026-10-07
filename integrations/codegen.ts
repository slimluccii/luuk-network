import type { AstroIntegration } from "astro";
import { generate, type CodegenConfig } from "@graphql-codegen/cli";
import { resolve } from "node:path";

export default function codegen(config: CodegenConfig): AstroIntegration {
  const run = () => generate({ ...config, silent: true });

  return {
    name: "codegen",
    hooks: {
      "astro:server:setup": ({ server, logger }) => {
        // Codegen writes .graphql output itself, which would otherwise retrigger it.
        const outputs = new Set(Object.keys(config.generates).map((path) => resolve(path)));
        let queue = Promise.resolve();

        server.watcher.on("all", (_event, path) => {
          if (!path.endsWith(".graphql") || outputs.has(resolve(path))) return;

          queue = queue.then(async () => {
            try {
              await run();
              logger.info("Regenerated");
            } catch (error) {
              logger.error(error instanceof Error ? error.message : String(error));
            }
          });
        });
      },
    },
  };
}
