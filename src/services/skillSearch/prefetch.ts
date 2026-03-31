type PendingSkillDiscoveryPrefetch = {
  promise: Promise<unknown[]>
}

export function startSkillDiscoveryPrefetch(
  _input: unknown,
  _messages: unknown[],
  _context: unknown,
): PendingSkillDiscoveryPrefetch {
  return {
    promise: Promise.resolve([]),
  }
}

export async function collectSkillDiscoveryPrefetch(
  pending: PendingSkillDiscoveryPrefetch,
): Promise<unknown[]> {
  return pending.promise
}

export async function getTurnZeroSkillDiscovery(
  _input: unknown,
  _messages: unknown[],
  _context: unknown,
): Promise<unknown[]> {
  return []
}
