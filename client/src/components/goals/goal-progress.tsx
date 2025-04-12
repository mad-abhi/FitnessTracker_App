import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Goal } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface GoalProgressProps {
  goal: Goal;
}

export function GoalProgress({ goal }: GoalProgressProps) {
  const { toast } = useToast();
  const progress = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  const progressColor = goal.completed ? "hsl(var(--secondary))" : 
                        progress >= 50 ? "hsl(var(--accent))" : 
                        "hsl(var(--primary))";
  
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Goal>) => {
      const response = await apiRequest("PUT", `/api/goals/${goal.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Goal has been updated",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${goal.userId}/goals`] });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const addProgress = (amount: number) => {
    const newValue = Math.min(goal.targetValue, goal.currentValue + amount);
    const completed = newValue >= goal.targetValue;
    
    updateMutation.mutate({
      currentValue: newValue,
      completed
    });
  };

  const markAsComplete = () => {
    updateMutation.mutate({
      currentValue: goal.targetValue,
      completed: true
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 mr-6">
            <ProgressRing
              value={goal.currentValue}
              max={goal.targetValue}
              size={80}
              color={progressColor}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{goal.description || "Progress"}</span>
              <span className="text-sm font-bold">
                {goal.currentValue}/{goal.targetValue} {goal.unit}
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 mb-2"
              indicatorClassName={goal.completed ? "bg-secondary" : progress >= 50 ? "bg-accent" : "bg-primary"}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Type: {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}</span>
              <span>Deadline: {formatDeadline(goal.deadline)}</span>
            </div>
          </div>
        </div>

        {!goal.completed && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addProgress(Math.max(0.1, goal.targetValue * 0.05))}
              disabled={updateMutation.isPending}
            >
              + {Math.max(0.1, goal.targetValue * 0.05).toFixed(1)} {goal.unit}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addProgress(Math.max(0.2, goal.targetValue * 0.1))}
              disabled={updateMutation.isPending}
            >
              + {Math.max(0.2, goal.targetValue * 0.1).toFixed(1)} {goal.unit}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={markAsComplete}
              disabled={updateMutation.isPending}
              className="ml-auto"
            >
              Complete Goal
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
