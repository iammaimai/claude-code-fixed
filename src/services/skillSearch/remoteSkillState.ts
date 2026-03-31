export type DiscoveredRemoteSkill = {
  slug: string
  url: string
}

const discoveredRemoteSkills = new Map<string, DiscoveredRemoteSkill>()

export function stripCanonicalPrefix(skillName: string): string | null {
  return skillName.startsWith('_canonical_')
    ? skillName.slice('_canonical_'.length)
    : null
}

export function getDiscoveredRemoteSkill(
  slug: string,
): DiscoveredRemoteSkill | undefined {
  return discoveredRemoteSkills.get(slug)
}

export function setDiscoveredRemoteSkill(skill: DiscoveredRemoteSkill): void {
  discoveredRemoteSkills.set(skill.slug, skill)
}
