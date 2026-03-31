let assistantForced = false

export function markAssistantForced(): void {
  assistantForced = true
}

export function isAssistantForced(): boolean {
  return assistantForced
}

export function isAssistantMode(): boolean {
  return assistantForced
}

export async function initializeAssistantTeam(): Promise<{
  teammates: unknown[]
}> {
  return { teammates: [] }
}

export function getAssistantSystemPromptAddendum(): string {
  return 'Assistant mode is unavailable in this recovery build.'
}

export function getAssistantActivationPath(): string {
  return assistantForced ? 'forced' : 'disabled'
}
