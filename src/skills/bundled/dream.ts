import { registerBundledSkill } from '../bundledSkills.js'

export function registerDreamSkill(): void {
  registerBundledSkill({
    name: 'dream',
    description: 'Unavailable internal dream workflow in recovery build',
    userInvocable: true,
    getPromptForCommand: async () => [
      {
        type: 'text',
        text: 'The /dream skill is not available in this recovery build.',
      },
    ],
  })
}
