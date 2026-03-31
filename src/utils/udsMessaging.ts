import { tmpdir } from 'os'
import { join } from 'path'

let socketPath: string | null = null
let onEnqueue: (() => void) | null = null

export function getDefaultUdsSocketPath(): string {
  return join(tmpdir(), 'claude-code-recovery.sock')
}

export function getUdsMessagingSocketPath(): string | null {
  return socketPath
}

export function setOnEnqueue(callback: (() => void) | null): void {
  onEnqueue = callback
}

export async function startUdsMessaging(
  path: string,
  _options?: { isExplicit?: boolean },
): Promise<void> {
  socketPath = path
}

export function notifyEnqueued(): void {
  onEnqueue?.()
}
