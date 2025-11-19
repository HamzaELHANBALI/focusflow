"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionCard } from "@/components/SessionCard";
import { ArrowLeft, Trash2 } from "lucide-react";
import { loadSessions, clearSessions, type Session } from "@/lib/storage";

export default function HistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadedSessions = loadSessions();
    // Sort by timestamp, newest first
    loadedSessions.sort((a, b) => b.timestamp - a.timestamp);
    setSessions(loadedSessions);
  }, []);

  const handleClearSessions = () => {
    if (
      confirm(
        "Are you sure you want to clear all session history? This cannot be undone."
      )
    ) {
      clearSessions();
      setSessions([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <Button variant="ghost" onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {sessions.length > 0 && (
            <Button variant="outline" onClick={handleClearSessions} className="flex-shrink-0">
              <Trash2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Clear History</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Session History</h1>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <p className="text-sm sm:text-base text-slate-500">
                No sessions yet. Complete a focus session to see your history here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

