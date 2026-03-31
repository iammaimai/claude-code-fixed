import * as React from 'react'
import { Box, Text } from '../../ink.js'

type Props = {
  workflow?: { summary?: string; description?: string }
  onBack?: () => void
  onKill?: () => void
  onSkipAgent?: (agentId: string) => void
  onRetryAgent?: (agentId: string) => void
}

export function WorkflowDetailDialog({ workflow }: Props): React.JSX.Element {
  return (
    <Box>
      <Text dimColor>
        {workflow?.summary ?? workflow?.description ?? 'Workflow details unavailable in this recovery build.'}
      </Text>
    </Box>
  )
}
