"use client";

import { Progress } from "@/components/ui/progress";

interface ATSScoreDisplayProps {
  score: number;
}

export function ATSScoreDisplay({ score }: ATSScoreDisplayProps) {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-green-600 dark:text-green-500";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const getProgressColor = () => {
    if (score >= 80) return "bg-green-600 dark:bg-green-500";
    if (score >= 60) return "bg-yellow-600 dark:bg-yellow-500";
    return "bg-red-600 dark:bg-red-500";
  };

  return (
    <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-md">
      <div className="text-sm font-medium">ATS Score:</div>
      <div className="flex items-center gap-2">
        <Progress
          value={score}
          className={`w-24 h-2 [&>div]:${getProgressColor()}`}
        />
        <span className={`text-sm font-semibold ${getScoreColor()}`}>
          {score}/100
        </span>
      </div>
    </div>
  );
}
