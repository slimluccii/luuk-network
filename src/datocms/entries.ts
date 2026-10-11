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
