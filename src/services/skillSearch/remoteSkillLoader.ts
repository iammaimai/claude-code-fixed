import { join } from 'path'

export type RemoteSkillLoadResult = {
  cacheHit: boolean
  latencyMs: number
  skillPath: string
  content: string
  fileCount: number
  totalBytes: number
  fetchMethod: 'recovery'
}

export async function loadRemoteSkill(
  slug: string,
  url: string,
): Promise<RemoteSkillLoadResult> {
  const content = `# ${slug}\n\nRemote skill loading is unavailable in this recovery build.\n\nRequested URL: ${url}\n`
  return {
    cacheHit: false,
    latencyMs: 0,
    skillPath: join(process.cwd(), '.recovery-remote-skills', slug, 'SKILL.md'),
    content,
    fileCount: 1,
    totalBytes: Buffer.byteLength(content, 'utf8'),
    fetchMethod: 'recovery',
  }
}
