"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "@/components/Timer";
import { SubtaskList } from "@/components/SubtaskList";
import { ReflectionModal } from "@/components/ReflectionModal";
import { TimerDurationModal } from "@/components/TimerDurationModal";
import {
  getTask,
  updateSubtaskStatus,
  saveTask,
  saveSession,
  getTimerDuration,
  type Subtask,
  type Task,
} from "@/lib/storage";
import { ArrowLeft } from "lucide-react";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [activeSubtask, setActiveSubtask] = useState<Subtask | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showTimerDurationModal, setShowTimerDurationModal] = useState(false);
  const [pendingSubtask, setPendingSubtask] = useState<Subtask | null>(null);
  const [timerDuration, setTimerDuration] = useState(25 * 60);

  useEffect(() => {
    if (taskId) {
      const loadedTask = getTask(taskId);
      if (loadedTask) {
        setTask(loadedTask);
      } else {
        // Task not found, redirect to tasks list
        router.push("/tasks");
      }
      setTimerDuration(getTimerDuration());
    }
  }, [taskId, router]);

  const handleStartSession = (subtask: Subtask) => {
    if (!task) return;
    setPendingSubtask(subtask);
    setShowTimerDurationModal(true);
  };

  const handleTimerDurationConfirm = (duration: number) => {
    if (!task || !pendingSubtask) return;
    setTimerDuration(duration);
    setActiveSubtask(pendingSubtask);
    setShowTimer(true);
    updateSubtaskStatus(pendingSubtask.id, "in_progress", task.id);
    // Reload task
    const updatedTask = getTask(taskId);
    if (updatedTask) {
      setTask(updatedTask);
    }
    setPendingSubtask(null);
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
    if (!activeSubtask || !task) return;

    // Save session with AI response
    const session = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      bigTask: task.bigTask,
      subtask: activeSubtask.title,
      notes,
      ai: aiResponse,
    };

    saveSession(session);

    // Update subtask status
    if (finished) {
      updateSubtaskStatus(activeSubtask.id, "done", task.id);
    } else {
      updateSubtaskStatus(activeSubtask.id, "pending", task.id);
    }

    // Reload task
    const updatedTask = getTask(taskId);
    if (updatedTask) {
      setTask(updatedTask);
    }
  };

  const handleReflectionClose = () => {
    setShowReflection(false);
    setShowTimer(false);
    setActiveSubtask(null);
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <p className="text-slate-500">Loading task...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/tasks")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Big Task</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm sm:text-base text-slate-700 break-words">{task.bigTask}</p>
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
                <Timer onComplete={handleTimerComplete} duration={timerDuration} />
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
                subtasks={task.subtasks}
                onStartSession={handleStartSession}
              />
            </CardContent>
          </Card>
        )}

        {activeSubtask && task && (
          <ReflectionModal
            open={showReflection}
            onOpenChange={handleReflectionClose}
            subtask={activeSubtask.title}
            bigTask={task.bigTask}
            onSubmit={handleReflectionSubmit}
          />
        )}

        <TimerDurationModal
          open={showTimerDurationModal}
          onOpenChange={setShowTimerDurationModal}
          onConfirm={handleTimerDurationConfirm}
        />
      </div>
    </div>
  );
}

