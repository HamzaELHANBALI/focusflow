export interface Subtask {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "done";
}

export interface Task {
  id: string;
  bigTask: string;
  subtasks: Subtask[];
  createdAt: number;
}

// Legacy interface for backward compatibility
export interface CurrentTask {
  bigTask: string;
  subtasks: Subtask[];
}

export interface Session {
  id: string;
  timestamp: number;
  bigTask: string;
  subtask: string;
  notes: string;
  ai: {
    drift: boolean;
    driftMessage?: string;
    nextStep: string;
    encouragement: string;
  };
}

const CURRENT_TASK_KEY = "focusflow-current-task"; // Legacy key
const TASKS_KEY = "focusflow-tasks";
const SESSIONS_KEY = "focusflow-sessions";
const TIMER_DURATION_KEY = "focusflow-timer-duration";

export function saveCurrentTask(task: CurrentTask): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CURRENT_TASK_KEY, JSON.stringify(task));
  } catch (error) {
    console.error("Failed to save current task:", error);
  }
}

export function loadCurrentTask(): CurrentTask | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(CURRENT_TASK_KEY);
    if (!data) return null;
    return JSON.parse(data) as CurrentTask;
  } catch (error) {
    console.error("Failed to load current task:", error);
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    const sessions = loadSessions();
    sessions.push(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

export function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    return JSON.parse(data) as Session[];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

export function clearSessions(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSIONS_KEY);
  } catch (error) {
    console.error("Failed to clear sessions:", error);
  }
}

export function updateSubtaskStatus(
  subtaskId: string,
  status: Subtask["status"],
  taskId?: string
): void {
  if (typeof window === "undefined") return;
  try {
    if (taskId) {
      // Update subtask in specific task
      const tasks = loadTasks();
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.subtasks = task.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, status } : st
        );
        saveTasks(tasks);
      }
    } else {
      // Legacy: update current task
      const task = loadCurrentTask();
      if (!task) return;
      task.subtasks = task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, status } : st
      );
      saveCurrentTask(task);
    }
  } catch (error) {
    console.error("Failed to update subtask status:", error);
  }
}

// New functions for multiple tasks
export function saveTask(task: Task): void {
  if (typeof window === "undefined") return;
  try {
    const tasks = loadTasks();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    saveTasks(tasks);
  } catch (error) {
    console.error("Failed to save task:", error);
  }
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (!data) {
      // Migrate from legacy current task
      const legacyTask = loadCurrentTask();
      if (legacyTask) {
        const migratedTask: Task = {
          id: crypto.randomUUID(),
          bigTask: legacyTask.bigTask,
          subtasks: legacyTask.subtasks,
          createdAt: Date.now(),
        };
        saveTask(migratedTask);
        return [migratedTask];
      }
      return [];
    }
    return JSON.parse(data) as Task[];
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
}

export function getTask(taskId: string): Task | null {
  if (typeof window === "undefined") return null;
  try {
    const tasks = loadTasks();
    return tasks.find((t) => t.id === taskId) || null;
  } catch (error) {
    console.error("Failed to get task:", error);
    return null;
  }
}

export function deleteTask(taskId: string): void {
  if (typeof window === "undefined") return;
  try {
    const tasks = loadTasks();
    const filtered = tasks.filter((t) => t.id !== taskId);
    saveTasks(filtered);
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

// Timer duration functions
export function getTimerDuration(): number {
  if (typeof window === "undefined") return 25 * 60; // Default 25 minutes
  try {
    const data = localStorage.getItem(TIMER_DURATION_KEY);
    if (!data) return 25 * 60;
    const duration = parseInt(data, 10);
    return duration > 0 ? duration : 25 * 60;
  } catch (error) {
    console.error("Failed to load timer duration:", error);
    return 25 * 60;
  }
}

export function saveTimerDuration(duration: number): void {
  if (typeof window === "undefined") return;
  try {
    if (duration > 0) {
      localStorage.setItem(TIMER_DURATION_KEY, duration.toString());
    }
  } catch (error) {
    console.error("Failed to save timer duration:", error);
  }
}

