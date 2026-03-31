type UseProactiveOptions = {
  isLoading?: boolean
  queuedCommandsLength?: number
  hasActiveLocalJsxUI?: boolean
  isInPlanMode?: boolean
  onSubmitTick?: (prompt: string) => void
  onQueueTick?: (prompt: string) => void
}

// Recovery build: keep the hook callable without reintroducing the original
// scheduler/runtime. The stateful public API lives in proactive/index.ts.
export function useProactive(_options: UseProactiveOptions): void {}
