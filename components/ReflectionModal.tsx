"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReflectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtask: string;
  bigTask: string;
  onSubmit: (notes: string, finished: boolean, aiResponse: {
    drift: boolean;
    driftMessage?: string;
    nextStep: string;
    encouragement: string;
  }) => Promise<void>;
}

export function ReflectionModal({
  open,
  onOpenChange,
  subtask,
  bigTask,
  onSubmit,
}: ReflectionModalProps) {
  const [notes, setNotes] = useState("");
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    drift: boolean;
    driftMessage?: string;
    nextStep: string;
    encouragement: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      alert("Please describe what you worked on.");
      return;
    }

    setLoading(true);
    try {
      // Fetch AI reflection first
      const response = await fetch("/api/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subtask,
          userNotes: notes,
          finished,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data);
        // Call onSubmit with AI response
        await onSubmit(notes, finished, data);
      } else {
        console.error("Failed to get AI reflection");
        // Still submit without AI response
        await onSubmit(notes, finished, {
          drift: false,
          nextStep: "Continue working on your current subtask.",
          encouragement: "Keep up the great work!",
        });
      }
    } catch (error) {
      console.error("Error submitting reflection:", error);
      // Still submit without AI response
      await onSubmit(notes, finished, {
        drift: false,
        nextStep: "Continue working on your current subtask.",
        encouragement: "Keep up the great work!",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNotes("");
    setFinished(false);
    setAiResponse(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Session Reflection</DialogTitle>
        </DialogHeader>

        {!aiResponse ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                What did you work on?
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what you accomplished during this session..."
                rows={5}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Did you finish this subtask?
              </label>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant={finished ? "default" : "outline"}
                  onClick={() => setFinished(true)}
                  className="flex-1 sm:flex-initial"
                >
                  Yes
                </Button>
                <Button
                  variant={!finished ? "default" : "outline"}
                  onClick={() => setFinished(false)}
                  className="flex-1 sm:flex-initial"
                >
                  No
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiResponse.drift && aiResponse.driftMessage && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm font-medium text-amber-900 mb-1">
                      ⚠️ Drift Warning
                    </p>
                    <p className="text-sm text-amber-800">
                      {aiResponse.driftMessage}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Next Step:
                  </p>
                  <p className="text-sm text-slate-600">
                    {aiResponse.nextStep}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Encouragement:
                  </p>
                  <p className="text-sm text-slate-600">
                    {aiResponse.encouragement}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleClose} className="w-full sm:w-auto">Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

