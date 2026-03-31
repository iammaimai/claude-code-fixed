import type { Task, TaskStateBase } from '../../Task.js'
import type { AppState } from '../../state/AppState.js'

export type MonitorMcpTaskState = TaskStateBase & {
  type: 'monitor_mcp'
}

function endMonitorTask(
  taskId: string,
  status: MonitorMcpTaskState['status'],
) {
  return (prev: AppState): AppState => {
    const task = prev.tasks?.[taskId]
    if (!task || task.type !== 'monitor_mcp') {
      return prev
    }

    return {
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskId]: {
          ...task,
          status,
          endTime: Date.now(),
        },
      },
    }
  }
}

export const MonitorMcpTask: Task = {
  name: 'MonitorMcpTask',
  type: 'monitor_mcp',
  async kill(taskId, setAppState) {
    setAppState(endMonitorTask(taskId, 'killed'))
  },
}

export function killMonitorMcp(
  taskId: string,
  setAppState: (f: (prev: AppState) => AppState) => void,
): void {
  setAppState(endMonitorTask(taskId, 'killed'))
}

export function killMonitorMcpTasksForAgent(
  _agentId: string,
  _setAppState: (f: (prev: AppState) => AppState) => void,
): void {}
