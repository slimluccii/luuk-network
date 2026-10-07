import { executeQuery as libExecuteQuery, type TypedDocumentNode } from "@datocms/cda-client";
import { loadEnv } from "vite";

export const { DATOCMS_TOKEN } = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export function executeQuery<Result, Variables>(
  query: TypedDocumentNode<Result, Variables>,
  variables?: Variables,
) {
  return libExecuteQuery<Result, Variables>(query, {
    token: DATOCMS_TOKEN,
    variables,
  });
}
