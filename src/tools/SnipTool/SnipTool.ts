import { SNIP_TOOL_NAME } from './prompt.js'

export const SnipTool = {
  name: SNIP_TOOL_NAME,
  isEnabled: () => false,
  userFacingName: () => 'Snip',
}
