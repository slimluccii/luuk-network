const onDemandBlocks = new Set(["ListBlockRecord", "ContactFormBlockRecord"]);

export function rendersOnDemand(content: ReadonlyArray<{ __typename: string }>): boolean {
  return content.some((block) => onDemandBlocks.has(block.__typename));
}
