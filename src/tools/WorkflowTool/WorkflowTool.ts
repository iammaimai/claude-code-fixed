import { WORKFLOW_TOOL_NAME } from './constants.js'

export const WorkflowTool = {
  name: WORKFLOW_TOOL_NAME,
  isEnabled: () => false,
  userFacingName: () => 'Workflow',
}
