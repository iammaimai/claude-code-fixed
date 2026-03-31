import type { Command } from '../commands.js'

type FetchMcpSkillsForClient = ((
  client: { name?: string },
) => Promise<Command[]>) & {
  cache: Map<string, Promise<Command[]>>
}

const fetchImpl = (async (client: { name?: string }) => {
  const key = client.name ?? 'default'
  const cached = fetchImpl.cache.get(key)
  if (cached) {
    return cached
  }
  const next = Promise.resolve([] as Command[])
  fetchImpl.cache.set(key, next)
  return next
}) as FetchMcpSkillsForClient

fetchImpl.cache = new Map()

export const fetchMcpSkillsForClient = fetchImpl
