import { registerBundledSkill } from '../bundledSkills.js'

export function registerRunSkillGeneratorSkill(): void {
  registerBundledSkill({
    name: 'run-skill-generator',
    description: 'Unavailable skill generator helper in recovery build',
    userInvocable: true,
    getPromptForCommand: async () => [
      {
        type: 'text',
        text: 'The /run-skill-generator skill is not available in this recovery build.',
      },
    ],
  })
}
