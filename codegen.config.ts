import type { CodegenConfig } from "@graphql-codegen/cli";
import graphqlConfig from "./graphql.config.json" with { type: "json" };
import { DATOCMS_TOKEN } from "./integrations/datocms";

const config: CodegenConfig = {
  schema: [
    {
      "https://graphql.datocms.com/": {
        headers: { Authorization: `Bearer ${DATOCMS_TOKEN}` },
      },
    },
  ],
  documents: graphqlConfig.documents,
  generates: {
    [graphqlConfig.schema]: {
      plugins: ["schema-ast"],
    },
    ".generated/datocms.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        dedupeFragments: true,
        useTypeImports: true,
        enumType: "const",
        strictScalars: true,
        scalars: {
          BooleanType: "boolean",
          CustomData: "Record<string, unknown>",
          Date: "string",
          DateTime: "string",
          FloatType: "number",
          IntType: "number",
          ItemId: "string",
          JsonField: "unknown",
          MetaTagAttributes: "Record<string, string>",
          UploadId: "string",
        },
      },
    },
  },
};

export default config;
