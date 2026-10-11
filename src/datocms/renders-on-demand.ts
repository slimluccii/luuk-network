export function rendersOnDemand(content: ReadonlyArray<{ __typename: string }>): boolean {
  return content.some((block) => block.__typename === "ListBlockRecord");
}
