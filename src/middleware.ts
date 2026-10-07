import { defineMiddleware } from "astro/middleware";
import { runWithLocale } from "~/i18n";

export const onRequest = defineMiddleware((context, next) =>
  runWithLocale(context.currentLocale, next),
);
