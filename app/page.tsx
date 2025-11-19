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
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Welcome to FocusFlow
              </h1>
              <p className="text-slate-600 mb-8">
                Break down your big tasks into manageable subtasks and stay
                focused.
              </p>
              <Button onClick={() => router.push("/new")} size="lg">
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">FocusFlow</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/history")}
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button onClick={() => router.push("/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Big Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">{currentTask.bigTask}</p>
          </CardContent>
        </Card>

        {showTimer && activeSubtask ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Focus Session: {activeSubtask.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Timer onComplete={handleTimerComplete} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Subtasks</CardTitle>
            </CardHeader>
            <CardContent>
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
