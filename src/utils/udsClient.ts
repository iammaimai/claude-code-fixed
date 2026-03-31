export type LiveSessionInfo = {
  sessionId?: string
  kind?: string
}

export async function listAllLiveSessions(): Promise<LiveSessionInfo[]> {
  return []
}

export async function sendToUdsSocket(
  _socketPath: string,
  _message: string,
): Promise<void> {
  throw new Error('UDS inbox is unavailable in this recovery build.')
}
