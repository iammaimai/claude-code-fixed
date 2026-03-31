import { registerBundledSkill } from '../bundledSkills.js'

export function registerHunterSkill(): void {
  registerBundledSkill({
    name: 'hunter',
    description: 'Unavailable review artifact skill in recovery build',
    userInvocable: true,
    getPromptForCommand: async () => [
      {
        type: 'text',
        text: 'The /hunter skill is not available in this recovery build.',
      },
    ],
  })
}
