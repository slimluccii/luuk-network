import { AsyncLocalStorage } from "node:async_hooks";
import translations from "~/generated/translations.json";

export type Locale = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["en"];

const DEFAULT_LOCALE: Locale = "en";

const isLocale = (value: string): value is Locale => value in translations;

export const toLocale = (value: string | undefined): Locale =>
  value !== undefined && isLocale(value) ? value : DEFAULT_LOCALE;

const requestLocale = new AsyncLocalStorage<Locale>();

/** Makes the request's locale available to `getLocale` for everything `fn` renders. */
export function runWithLocale<T>(locale: string | undefined, fn: () => T) {
  return requestLocale.run(toLocale(locale), fn);
}

// Outside a request (loaders, scripts) there is no store, so this falls back to the default
export const getLocale = (): Locale => requestLocale.getStore() ?? DEFAULT_LOCALE;

// Simple {placeholder} substitution, not full ICU MessageFormat.
function interpolate(message: string, values: Record<string, string | number>) {
  return message.replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`,
  );
}

export function t(
  key: TranslationKey,
  values?: Record<string, string | number>,
  locale: Locale = getLocale(),
) {
  const messages: Record<string, string> = translations[locale];
  const message = messages[key] ?? key;
  return values ? interpolate(message, values) : message;
}

export const n = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(getLocale(), options).format(value);

export const d = (value: Date | string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(getLocale(), options).format(new Date(value));
