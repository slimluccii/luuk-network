import { getEntry } from "astro:content";
import { MenuDocument, type SiteLocale } from "~/generated/datocms";
import { executeQuery } from "./execute-query";

export type MenuItem = {
  id: string;
  label: string;
  href: string;
};

export async function getMenuItems(locale: SiteLocale): Promise<MenuItem[]> {
  const { menu } = await executeQuery(MenuDocument, { locale });
  if (!menu) return [];

  const items = await Promise.all(
    menu.items.map(async (item) => {
      if (!item.page) return null;
      const entry = await getEntry("pages", `${locale}/${item.page.id}`);
      if (!entry) return null;
      return { id: item.id, label: item.title ?? "", href: entry.data.path };
    }),
  );

  return items.filter((item): item is MenuItem => item !== null);
}
