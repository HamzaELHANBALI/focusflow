export interface Subtask {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "done";
}

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

const CURRENT_TASK_KEY = "focusflow-current-task";
const SESSIONS_KEY = "focusflow-sessions";

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
  status: Subtask["status"]
): void {
  if (typeof window === "undefined") return;
  try {
    const task = loadCurrentTask();
    if (!task) return;
    task.subtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, status } : st
    );
    saveCurrentTask(task);
  } catch (error) {
    console.error("Failed to update subtask status:", error);
  }
}

