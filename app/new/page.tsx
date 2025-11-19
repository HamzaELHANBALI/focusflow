"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { saveCurrentTask, type CurrentTask, type Subtask } from "@/lib/storage";

export default function NewTaskPage() {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) {
      setError("Please enter a task");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: task.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate subtasks");
      }

      const data = await response.json();
      const subtasks: Subtask[] = data.subtasks.map((title: string) => ({
        id: crypto.randomUUID(),
        title,
        status: "pending" as const,
      }));

      const currentTask: CurrentTask = {
        bigTask: task.trim(),
        subtasks,
      };

      saveCurrentTask(currentTask);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate subtasks. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="task"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
                  What's your big task?
                </label>
                <Input
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="e.g., Finish the landing page for my app"
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-2">
                  We'll break this down into actionable subtasks for you.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !task.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Subtasks"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

