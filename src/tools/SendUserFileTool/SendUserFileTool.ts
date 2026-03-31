import { SEND_USER_FILE_TOOL_NAME } from './prompt.js'

export const SendUserFileTool = {
  name: SEND_USER_FILE_TOOL_NAME,
  isEnabled: () => false,
  userFacingName: () => 'Send User File',
}
