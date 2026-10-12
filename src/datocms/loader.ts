import type { Loader, LoaderContext } from "astro/loaders";
import { LoaderDocument, SiteLocale, type LoaderQuery } from "~/generated/datocms";
import { z } from "astro/zod";
import { executeQuery } from "./execute-query";
import { buildIndexMap } from "./build-index-map";
import { resolvePath, type RoutablePage } from "./resolve-path";
import { rendersOnDemand } from "./renders-on-demand";

type EntryData = (
  | LoaderQuery["allPages"][number]
  | LoaderQuery["allPosts"][number]
  | LoaderQuery["allProjects"][number]
) & {
  locale: string;
  path: string;
  onDemand?: boolean;
  indexPage?: { title: string | null; path: string };
  translations: Array<{ locale: string; path: string }>;
};

export function loader() {
  return {
    name: "datocms-loader",
    load: async ({ store, parseData, config }) => {
      if (!config.i18n) return;

      const locales = Object.values(SiteLocale);
      const fallbackLocales = locales.filter((locale) => locale === config.i18n?.defaultLocale);

      const results = new Map<string, LoaderQuery>(
        await Promise.all(
          locales.map(
            async (locale) =>
              [locale, await executeQuery(LoaderDocument, { locale, fallbackLocales })] as const,
          ),
        ),
      );

      await write(results, store, parseData);
    },
    schema: z.custom<EntryData>(),
  } satisfies Loader;
}

function toEntries(locale: string, result: LoaderQuery) {
  const { _site, allRoutes, allPages, allPosts, allProjects } = result;

  // Global favicon tags, prepended to every page's SEO meta tags so
  // the page <Seo> renders them in one pass.
  const favicon = _site.faviconMetaTags;

  const pageById = new Map(allPages.map((p) => [p.id, p]));
  const indexByCollection = buildIndexMap(allRoutes);

  const prefixCache = new Map<string, string>();
  const prefixFor = (page: RoutablePage): string => {
    let prefix = prefixCache.get(page.id);
    if (prefix === undefined) {
      prefix = resolvePath(page, pageById);
      prefixCache.set(page.id, prefix);
    }
    return prefix;
  };

  // Full locale-prefixed URL — the single source of truth for routing,
  // translation links and hreflang. `resolvePath` returns "/" for the
  // home page, which collapses to just the locale segment.
  const toUrl = (path: string) => `/${locale}${path === "/" ? "" : path}`;

  const entries = [];

  for (const page of allPages) {
    if (page.slug == null) continue;
    entries.push({
      id: `${locale}/${page.id}`,
      data: {
        ...page,
        locale,
        path: toUrl(prefixFor(page)),
        onDemand: rendersOnDemand(page.content),
        _seoMetaTags: [...favicon, ...page._seoMetaTags],
      },
    });
  }

  for (const record of [...allPosts, ...allProjects]) {
    if (record.slug == null) continue;
    const indexPageId = indexByCollection.get(record._modelApiKey);
    const indexPage = indexPageId ? pageById.get(indexPageId) : undefined;
    if (!indexPage) {
      throw new Error(`Geen indexpagina voor collectie "${record._modelApiKey}"`);
    }
    entries.push({
      id: `${locale}/${record.id}`,
      data: {
        ...record,
        locale,
        path: toUrl(`${prefixFor(indexPage)}/${record.slug}`),
        indexPage: { title: indexPage.title, path: toUrl(prefixFor(indexPage)) },
        _seoMetaTags: [...favicon, ...record._seoMetaTags],
      },
    });
  }

  return entries;
}

async function write(
  results: Map<string, LoaderQuery>,
  store: LoaderContext["store"],
  parseData: LoaderContext["parseData"],
) {
  const entries = [...results].flatMap(([locale, result]) => toEntries(locale, result));

  // A DatoCMS record shares one id across locales, so group by `data.id` to
  // collect every locale's path — the translation links for that page.
  const translationsById = new Map();
  for (const { data } of entries) {
    const list = translationsById.get(data.id) ?? [];
    list.push({ locale: data.locale, path: data.path });
    translationsById.set(data.id, list);
  }

  const parsed = await Promise.all(
    entries.map(async ({ id, data }) => ({
      id,
      data: await parseData({ id, data: { ...data, translations: translationsById.get(data.id) } }),
    })),
  );

  store.clear();
  for (const entry of parsed) store.set(entry);
}
