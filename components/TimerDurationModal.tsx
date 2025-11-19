"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTimerDuration } from "@/lib/storage";

interface TimerDurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (duration: number) => void;
}

const PRESET_DURATIONS = [
  { label: "15 min", value: 15 * 60 },
  { label: "25 min", value: 25 * 60 },
  { label: "30 min", value: 30 * 60 },
  { label: "45 min", value: 45 * 60 },
  { label: "60 min", value: 60 * 60 },
];

export function TimerDurationModal({
  open,
  onOpenChange,
  onConfirm,
}: TimerDurationModalProps) {
  const defaultDuration = typeof window !== "undefined" ? getTimerDuration() : 25 * 60;
  const [minutes, setMinutes] = useState(Math.floor(defaultDuration / 60));

  const handleConfirm = () => {
    const duration = minutes * 60;
    if (duration > 0 && duration <= 120 * 60) {
      onConfirm(duration);
      onOpenChange(false);
    }
  };

  const handlePreset = (seconds: number) => {
    setMinutes(Math.floor(seconds / 60));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Set Timer Duration</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="timer-minutes"
              className="text-sm font-medium text-slate-700 mb-2 block"
            >
              Duration (minutes)
            </label>
            <Input
              id="timer-minutes"
              type="number"
              min="1"
              max="120"
              value={minutes}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value > 0 && value <= 120) {
                  setMinutes(value);
                }
              }}
              className="w-full"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_DURATIONS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={Math.floor(preset.value / 60) === minutes ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePreset(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
              Start Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

