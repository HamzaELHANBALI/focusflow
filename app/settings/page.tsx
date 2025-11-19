"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import { getTimerDuration, saveTimerDuration } from "@/lib/storage";

export default function SettingsPage() {
  const router = useRouter();
  const [minutes, setMinutes] = useState(25);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const duration = getTimerDuration();
    setMinutes(Math.floor(duration / 60));
  }, []);

  const handleSave = () => {
    const duration = minutes * 60;
    if (duration > 0) {
      saveTimerDuration(duration);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const presetDurations = [
    { label: "15 min", value: 15 },
    { label: "25 min", value: 25 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ];

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 sm:mb-6 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Settings
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">Customize your FocusFlow experience</p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-6">
            <div>
              <label
                htmlFor="timer-duration"
                className="text-sm font-medium text-slate-700 mb-2 block"
              >
                Timer Duration (minutes)
              </label>
              <div className="space-y-4">
                <Input
                  id="timer-duration"
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
                <div className="flex flex-wrap gap-2">
                  {presetDurations.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={minutes === preset.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMinutes(preset.value)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Set the default duration for focus sessions. You can change this anytime.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              {saved && (
                <span className="text-sm text-green-600 flex items-center">
                  Settings saved!
                </span>
              )}
              <Button onClick={handleSave} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

