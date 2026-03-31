import type { Command, LocalCommandCall } from '../types/command.js'

export function createUnavailableCommand(
  name: string,
  description: string,
  aliases?: string[],
): Command {
  const call: LocalCommandCall = async () => ({
    type: 'text',
    value: `/${name} is unavailable in this recovery build.`,
  })

  return {
    type: 'local',
    name,
    description,
    ...(aliases ? { aliases } : {}),
    supportsNonInteractive: true,
    load: () => Promise.resolve({ call }),
  }
}
