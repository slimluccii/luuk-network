import { getActionContext } from "astro:actions";
import { defineMiddleware, sequence } from "astro/middleware";
import { i18n } from "astro:config/server";
import { LOCALE_COOKIE, runWithLocale } from "~/i18n";

const locales = (i18n?.locales ?? []).map((locale) =>
  typeof locale === "string" ? locale : locale.path,
);
const defaultLocale = i18n?.defaultLocale ?? "en";

const isLocale = (value: string | undefined): value is string =>
  value !== undefined && locales.includes(value);

const redirectRoot = defineMiddleware((context, next) => {
  if (context.isPrerendered || context.url.pathname !== "/") return next();

  const cookie = context.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie)
    ? cookie
    : isLocale(context.preferredLocale)
      ? context.preferredLocale
      : defaultLocale;

  return context.redirect(`/${locale}/`, 302);
});

// Redirect after a successful form post so a refresh does not send it again
const redirectAfterAction = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  const actionContext = getActionContext(context);
  const { action } = actionContext;
  if (action?.calledFrom !== "form") return next();

  const result = await action.handler();
  if (!result.error) {
    return context.redirect(`${context.url.pathname}?sent=${action.name}`, 303);
  }
  actionContext.setActionResult(action.name, actionContext.serializeActionResult(result));
  return next();
});

const provideLocale = defineMiddleware((context, next) =>
  runWithLocale(context.currentLocale, next),
);

export const onRequest = sequence(redirectRoot, provideLocale, redirectAfterAction);
