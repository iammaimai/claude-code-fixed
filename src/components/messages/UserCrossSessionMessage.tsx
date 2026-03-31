import * as React from 'react'
import type { TextBlockParam } from '@anthropic-ai/sdk/resources/index.mjs'
import { UserPromptMessage } from './UserPromptMessage.js'

type Props = {
  addMargin: boolean
  param: TextBlockParam
}

export function UserCrossSessionMessage(props: Props): React.JSX.Element {
  return <UserPromptMessage {...props} />
}
