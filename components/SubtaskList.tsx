"use client";

import { Subtask } from "@/lib/storage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

interface SubtaskListProps {
  subtasks: Subtask[];
  onStartSession: (subtask: Subtask) => void;
}

export function SubtaskList({ subtasks, onStartSession }: SubtaskListProps) {
  const getStatusIcon = (status: Subtask["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Subtask["status"]) => {
    switch (status) {
      case "done":
        return "border-green-200 bg-green-50";
      case "in_progress":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-slate-200 bg-white";
    }
  };

  if (subtasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-slate-500">
          No subtasks yet. Create a new task to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {subtasks.map((subtask) => (
        <Card
          key={subtask.id}
          className={`${getStatusColor(subtask.status)} transition-colors`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(subtask.status)}
                <span
                  className={`flex-1 ${
                    subtask.status === "done"
                      ? "line-through text-slate-500"
                      : "text-slate-900"
                  }`}
                >
                  {subtask.title}
                </span>
              </div>
              {subtask.status !== "done" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartSession(subtask)}
                >
                  {subtask.status === "in_progress"
                    ? "Continue"
                    : "Start"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

