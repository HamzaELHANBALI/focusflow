"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  onComplete: () => void;
}

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

export function Timer({ onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(POMODORO_DURATION);
  };

  const progress = ((POMODORO_DURATION - timeLeft) / POMODORO_DURATION) * 100;

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="relative">
            <div className="text-5xl sm:text-6xl font-mono font-bold text-slate-900">
              {formatTime(timeLeft)}
            </div>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="flex-1 sm:flex-initial">
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" size="lg" className="flex-1 sm:flex-initial">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" size="lg" className="flex-1 sm:flex-initial">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

