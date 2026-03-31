import * as React from 'react'
import { Box, Text } from '../ink.js'

type Props = {
  onDone?: () => void
}

export function UndercoverAutoCallout(_props: Props): React.JSX.Element {
  return (
    <Box>
      <Text dimColor>Undercover auto guidance is unavailable in this recovery build.</Text>
    </Box>
  )
}
