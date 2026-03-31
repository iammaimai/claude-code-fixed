export async function postInterClaudeMessage(
  _target: string,
  _message: string,
): Promise<{ ok: boolean; error?: string }> {
  return {
    ok: false,
    error: 'Remote control messaging is unavailable in this recovery build.',
  }
}
