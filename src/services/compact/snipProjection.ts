export function projectSnippedView<T>(messages: T[]): T[] {
  return messages
}

export function isSnipBoundaryMessage(message: unknown): boolean {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    'subtype' in message &&
    (message as { type?: string; subtype?: string }).type === 'system' &&
    (message as { subtype?: string }).subtype === 'snip_boundary'
  )
}
