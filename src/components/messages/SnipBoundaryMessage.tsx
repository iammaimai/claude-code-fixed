import * as React from 'react'
import { Text } from '../../ink.js'

type Props = {
  message?: {
    content?: string
  }
}

export function SnipBoundaryMessage({ message }: Props): React.JSX.Element {
  return <Text dimColor>{message?.content ?? 'Earlier context was trimmed.'}</Text>
}
