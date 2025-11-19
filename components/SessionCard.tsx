"use client";

import { Session } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const date = new Date(session.timestamp);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {format(date, "MMM d, yyyy 'at' h:mm a")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Big Task:</p>
          <p className="text-sm text-slate-600">{session.bigTask}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Subtask:</p>
          <p className="text-sm text-slate-600">{session.subtask}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Notes:</p>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {session.notes}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200">
          {session.ai.drift && session.ai.driftMessage && (
            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs font-medium text-amber-900 mb-1">
                ⚠️ Drift Warning
              </p>
              <p className="text-xs text-amber-800">
                {session.ai.driftMessage}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-slate-700 mb-1">
                Next Step:
              </p>
              <p className="text-xs text-slate-600">{session.ai.nextStep}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700 mb-1">
                Encouragement:
              </p>
              <p className="text-xs text-slate-600">
                {session.ai.encouragement}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

