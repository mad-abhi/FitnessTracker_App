import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Link } from "wouter";
import { Goal } from "@shared/schema";

interface GoalsProgressProps {
  goals: Goal[];
  isLoading?: boolean;
}

export function GoalsProgress({ goals, isLoading = false }: GoalsProgressProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Goals Progress</h2>
            <Link href="/goals">
              <a className="text-primary text-sm font-medium">View All</a>
            </Link>
          </div>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Goals Progress</h2>
          <Link href="/goals">
            <a className="text-primary text-sm font-medium">View All</a>
          </Link>
        </div>
        
        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No goals set yet. Add your first goal!</p>
          ) : (
            goals.map((goal) => {
              const progress = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
              const color = goal.completed ? "hsl(var(--secondary))" : 
                            progress >= 50 ? "hsl(var(--accent))" : 
                            "hsl(var(--primary))";
              
              return (
                <div key={goal.id} className="flex items-center">
                  <div className="w-16 h-16 mr-4">
                    <ProgressRing
                      value={goal.currentValue}
                      max={goal.targetValue}
                      size={64}
                      color={color}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium">{goal.title}</h3>
                      <span className="text-sm font-bold">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                      indicatorClassName={goal.completed ? "bg-secondary" : progress >= 50 ? "bg-accent" : "bg-primary"}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
