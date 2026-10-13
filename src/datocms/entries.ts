import { getCollection } from "astro:content";

export function getPrerenderedEntries() {
  return getCollection("pages", (entry) => !entry.data.onDemand);
}

export async function getOnDemandEntry(url: URL) {
  const path = url.pathname.replace(/\/$/, "");
  const [entry] = await getCollection(
    "pages",
    (entry) => entry.data.onDemand === true && entry.data.path === path,
  );
  return entry;
}

export async function getContactFormPath(locale: string) {
  const [entry] = await getCollection(
    "pages",
    (entry) =>
      entry.data.locale === locale &&
      "content" in entry.data &&
      Array.isArray(entry.data.content) &&
      entry.data.content.some((block) => block.__typename === "ContactFormBlockRecord"),
  );
  return entry?.data.path;
}
