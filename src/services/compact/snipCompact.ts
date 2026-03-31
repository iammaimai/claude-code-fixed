export function isSnipRuntimeEnabled(): boolean {
  return false
}

export function shouldNudgeForSnips(_messages: unknown[]): boolean {
  return false
}

export function snipCompactIfNeeded<T>(
  messages: T[],
  _options?: { force?: boolean },
): {
  messages: T[]
  tokensFreed: number
  boundaryMessage?: unknown
} {
  return {
    messages,
    tokensFreed: 0,
  }
}

export function isSnipMarkerMessage(message: unknown): boolean {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    'subtype' in message &&
    (message as { type?: string; subtype?: string }).type === 'system' &&
    (message as { subtype?: string }).subtype === 'snip_marker'
  )
}
