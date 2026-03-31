import * as React from 'react'
import { Box, Text } from '../ink.js'

type Props = {
  onDone?: (selection: string, modelAlias?: string) => void
}

export function AntModelSwitchCallout(_props: Props): React.JSX.Element {
  return (
    <Box>
      <Text dimColor>Model switch recommendations are unavailable in this recovery build.</Text>
    </Box>
  )
}

export function shouldShowModelSwitchCallout(): boolean {
  return false
}
