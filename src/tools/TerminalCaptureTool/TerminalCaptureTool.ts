import { TERMINAL_CAPTURE_TOOL_NAME } from './prompt.js'

export const TerminalCaptureTool = {
  name: TERMINAL_CAPTURE_TOOL_NAME,
  isEnabled: () => false,
  userFacingName: () => 'Terminal Capture',
}
