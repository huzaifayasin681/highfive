import { prisma } from "@/lib/prisma";

/**
 * Returns the admin-editable value for a content key, falling back to the
 * provided default when the block hasn't been set. Used by the public site so
 * the admin Content manager actually drives the marketing copy.
 */
export async function getContent(key: string, fallback: string): Promise<string> {
  const block = await prisma.contentBlock.findUnique({ where: { key } });
  return block?.value?.trim() ? block.value : fallback;
}

/** Batch fetch many content keys at once (one query). */
export async function getContentMap(
  keys: string[]
): Promise<Record<string, string | undefined>> {
  const blocks = await prisma.contentBlock.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string | undefined> = {};
  for (const b of blocks) map[b.key] = b.value;
  return map;
}
