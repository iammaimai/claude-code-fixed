type ProactiveSource = 'command' | 'config' | 'unknown'

type Listener = () => void

type ProactiveState = {
  active: boolean
  paused: boolean
  contextBlocked: boolean
  nextTickAt: number | null
  source: ProactiveSource
}

const listeners = new Set<Listener>()

const state: ProactiveState = {
  active: false,
  paused: false,
  contextBlocked: false,
  nextTickAt: null,
  source: 'unknown',
}

function emit(): void {
  for (const listener of listeners) {
    listener()
  }
}

function setState(
  patch: Partial<ProactiveState> | ((current: ProactiveState) => Partial<ProactiveState>),
): void {
  const nextPatch = typeof patch === 'function' ? patch(state) : patch
  let changed = false
  for (const [key, value] of Object.entries(nextPatch)) {
    if ((state as Record<string, unknown>)[key] !== value) {
      ;(state as Record<string, unknown>)[key] = value
      changed = true
    }
  }
  if (changed) {
    emit()
  }
}

export function subscribeToProactiveChanges(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function isProactiveActive(): boolean {
  return state.active
}

export function activateProactive(source: ProactiveSource = 'unknown'): void {
  setState({
    active: true,
    paused: false,
    contextBlocked: false,
    nextTickAt: null,
    source,
  })
}

export function deactivateProactive(): void {
  setState({
    active: false,
    paused: false,
    contextBlocked: false,
    nextTickAt: null,
  })
}

export function isProactivePaused(): boolean {
  return state.paused
}

export function pauseProactive(): void {
  if (!state.active) return
  setState({
    paused: true,
    nextTickAt: null,
  })
}

export function resumeProactive(): void {
  if (!state.active) return
  setState({
    paused: false,
    nextTickAt: null,
  })
}

export function setContextBlocked(blocked: boolean): void {
  setState({
    contextBlocked: blocked,
    nextTickAt: blocked ? null : state.nextTickAt,
  })
}

export function getNextTickAt(): number | null {
  return state.nextTickAt
}

export function getProactiveState(): Readonly<ProactiveState> {
  return state
}
