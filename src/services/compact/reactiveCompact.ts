export function isReactiveCompactEnabled(): boolean {
  return false
}

export function isReactiveOnlyMode(): boolean {
  return false
}

export function isWithheldPromptTooLong(_message: unknown): boolean {
  return false
}

export function isWithheldMediaSizeError(_message: unknown): boolean {
  return false
}

export async function tryReactiveCompact(_input: {
  hasAttempted: boolean
  querySource?: unknown
  aborted?: boolean
  messages: unknown[]
  cacheSafeParams?: unknown
}): Promise<null> {
  return null
}

export async function reactiveCompactOnPromptTooLong(
  _messages: unknown[],
  _cacheSafeParams: unknown,
  _options?: unknown,
): Promise<
  | {
      ok: true
      result: {
        messages: unknown[]
        summary: string
        userDisplayMessage?: string
      }
    }
  | {
      ok: false
      reason:
        | 'too_few_groups'
        | 'aborted'
        | 'exhausted'
        | 'error'
        | 'media_unstrippable'
    }
> {
  return {
    ok: false,
    reason: 'too_few_groups',
  }
}
