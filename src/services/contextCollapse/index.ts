type Listener = () => void

type CollapseHealth = {
  totalSpawns: number
  totalErrors: number
  totalEmptySpawns: number
  emptySpawnWarningEmitted: boolean
  lastError: string | null
}

type CollapseStats = {
  collapsedSpans: number
  collapsedMessages: number
  stagedSpans: number
  health: CollapseHealth
}

const listeners = new Set<Listener>()

const emptyStats: CollapseStats = {
  collapsedSpans: 0,
  collapsedMessages: 0,
  stagedSpans: 0,
  health: {
    totalSpawns: 0,
    totalErrors: 0,
    totalEmptySpawns: 0,
    emptySpawnWarningEmitted: false,
    lastError: null,
  },
}

function emit(): void {
  for (const listener of listeners) {
    listener()
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getStats(): CollapseStats {
  return emptyStats
}

export function isContextCollapseEnabled(): boolean {
  return false
}

export async function applyCollapsesIfNeeded<T>(
  messages: T[],
  _toolUseContext?: unknown,
  _querySource?: unknown,
): Promise<{ messages: T[] }> {
  return { messages }
}

export function isWithheldPromptTooLong(
  _message: unknown,
  _isPromptTooLongMessage?: (message: string) => boolean,
  _querySource?: unknown,
): boolean {
  return false
}

export function recoverFromOverflow<T>(
  messages: T[],
  _querySource?: unknown,
): { messages: T[]; committed: number } {
  return {
    messages,
    committed: 0,
  }
}

export function resetContextCollapse(): void {
  emit()
}
