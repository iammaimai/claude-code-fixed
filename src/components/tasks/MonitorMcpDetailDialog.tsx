import * as React from 'react'
import { Box, Text } from '../../ink.js'

type Props = {
  task?: { description?: string }
  onBack?: () => void
  onKill?: () => void
}

export function MonitorMcpDetailDialog({ task }: Props): React.JSX.Element {
  return (
    <Box>
      <Text dimColor>
        {task?.description ?? 'Monitor details unavailable in this recovery build.'}
      </Text>
    </Box>
  )
}
