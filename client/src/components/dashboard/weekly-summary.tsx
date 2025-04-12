import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WeeklySummaryProps {
  workouts: number;
  totalTime: string;
  calories: number;
}

export function WeeklySummary({ workouts, totalTime, calories }: WeeklySummaryProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="material-icons text-primary text-3xl mb-2">event_available</span>
            <span className="text-2xl font-bold">{workouts}</span>
            <span className="text-sm text-gray-500">Workouts</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="material-icons text-orange-500 text-3xl mb-2">timer</span>
            <span className="text-2xl font-bold">{totalTime}</span>
            <span className="text-sm text-gray-500">Total Time</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="material-icons text-green-500 text-3xl mb-2">local_fire_department</span>
            <span className="text-2xl font-bold">{calories.toLocaleString()}</span>
            <span className="text-sm text-gray-500">Calories</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
