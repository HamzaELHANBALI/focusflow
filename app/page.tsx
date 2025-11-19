"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "@/components/Timer";
import { SubtaskList } from "@/components/SubtaskList";
import { ReflectionModal } from "@/components/ReflectionModal";
import {
  loadCurrentTask,
  updateSubtaskStatus,
  saveSession,
  type Subtask,
  type CurrentTask,
} from "@/lib/storage";
import { Plus, History } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null);
  const [activeSubtask, setActiveSubtask] = useState<Subtask | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const task = loadCurrentTask();
    setCurrentTask(task);
  }, []);

  const handleStartSession = (subtask: Subtask) => {
    setActiveSubtask(subtask);
    setShowTimer(true);
    updateSubtaskStatus(subtask.id, "in_progress");
    const task = loadCurrentTask();
    if (task) {
      setCurrentTask(task);
    }
  };

  const handleTimerComplete = () => {
    setShowReflection(true);
  };

  const handleReflectionSubmit = async (
    notes: string,
    finished: boolean,
    aiResponse: {
      drift: boolean;
      driftMessage?: string;
      nextStep: string;
      encouragement: string;
    }
  ) => {
    if (!activeSubtask || !currentTask) return;

    // Save session with AI response
    const session = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      bigTask: currentTask.bigTask,
      subtask: activeSubtask.title,
      notes,
      ai: aiResponse,
    };

    saveSession(session);

    // Update subtask status
    if (finished) {
      updateSubtaskStatus(activeSubtask.id, "done");
    } else {
      updateSubtaskStatus(activeSubtask.id, "pending");
    }

    // Reload current task
    const updatedTask = loadCurrentTask();
    if (updatedTask) {
      setCurrentTask(updatedTask);
    }
  };

  const handleReflectionClose = () => {
    setShowReflection(false);
    setShowTimer(false);
    setActiveSubtask(null);
  };

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Welcome to FocusFlow
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
                Break down your big tasks into manageable subtasks and stay
                focused.
              </p>
              <Button onClick={() => router.push("/new")} size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">FocusFlow</h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => router.push("/history")}
              className="flex-1 sm:flex-initial"
            >
              <History className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
            <Button onClick={() => router.push("/new")} className="flex-1 sm:flex-initial">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Current Big Task</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-slate-700 break-words">{currentTask.bigTask}</p>
          </CardContent>
        </Card>

        {showTimer && activeSubtask ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl break-words">
                  Focus Session: {activeSubtask.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Timer onComplete={handleTimerComplete} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Subtasks</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <SubtaskList
                subtasks={currentTask.subtasks}
                onStartSession={handleStartSession}
              />
            </CardContent>
          </Card>
        )}

        {activeSubtask && currentTask && (
          <ReflectionModal
            open={showReflection}
            onOpenChange={handleReflectionClose}
            subtask={activeSubtask.title}
            bigTask={currentTask.bigTask}
            onSubmit={handleReflectionSubmit}
          />
        )}
      </div>
    </div>
  );
}
