export function useFrustrationDetection(
  _messages: unknown[],
  _isLoading: boolean,
  _hasActivePrompt: boolean,
  _surveyOpen: boolean,
): {
  state: 'closed'
  handleTranscriptSelect: () => void
} {
  return {
    state: 'closed',
    handleTranscriptSelect: () => {},
  }
}
