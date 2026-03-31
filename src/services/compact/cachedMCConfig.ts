export function getCachedMCConfig(): {
  enabled: boolean
  systemPromptSuggestSummaries: boolean
  supportedModels: string[]
} {
  return {
    enabled: false,
    systemPromptSuggestSummaries: false,
    supportedModels: [],
  }
}
