"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, History, Settings, ChevronRight, Trash2 } from "lucide-react";
import { loadTasks, deleteTask, type Task } from "@/lib/storage";
import { format } from "date-fns";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadedTasks = loadTasks();
    // Sort by creation date, newest first
    loadedTasks.sort((a, b) => b.createdAt - a.createdAt);
    setTasks(loadedTasks);
  }, []);

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this task? This cannot be undone.")) {
      deleteTask(taskId);
      setTasks(loadTasks().sort((a, b) => b.createdAt - a.createdAt));
    }
  };

  const getProgress = (task: Task) => {
    const total = task.subtasks.length;
    const done = task.subtasks.filter((st) => st.status === "done").length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">My Tasks</h1>
            <p className="text-sm text-slate-500">Manage your focus sessions</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.push("/history")}
              className="flex-1 sm:flex-initial"
            >
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/settings")}
              className="flex-1 sm:flex-initial"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button onClick={() => router.push("/new")} className="flex-1 sm:flex-initial">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <Card className="border-slate-200 shadow-lg">
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
                No tasks yet
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-6">
                Create your first task to get started with FocusFlow.
              </p>
              <Button onClick={() => router.push("/new")} size="lg" className="w-full sm:w-auto shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {tasks.map((task) => {
              const progress = getProgress(task);
              const inProgress = task.subtasks.some((st) => st.status === "in_progress");
              return (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:shadow-lg hover:border-slate-300 transition-all duration-200 border-slate-200"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
                            {task.bigTask}
                          </h3>
                          {inProgress && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                              In Progress
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <span>{task.subtasks.length} subtasks</span>
                          <span>•</span>
                          <span>{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-slate-900 to-slate-700 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {progress}% complete
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

