import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Workout } from "@shared/schema";

interface EnrichedWorkout extends Workout {
  exercises: number;
}

interface RecentWorkoutsProps {
  workouts: EnrichedWorkout[];
  isLoading?: boolean;
}

export function RecentWorkouts({ workouts, isLoading = false }: RecentWorkoutsProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Workouts</h2>
            <Link href="/workouts">
              <a className="text-primary text-sm font-medium">View All</a>
            </Link>
          </div>
          <div className="space-y-4 mt-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWorkoutIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cardio':
      case 'running':
        return { icon: 'directions_run', color: 'text-accent bg-accent bg-opacity-10' };
      case 'flexibility':
      case 'yoga':
      case 'core':
        return { icon: 'self_improvement', color: 'text-secondary bg-secondary bg-opacity-10' };
      case 'strength':
      case 'strength training':
      default:
        return { icon: 'fitness_center', color: 'text-primary bg-primary bg-opacity-10' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // Check if it's within the last week
      const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < 7) {
        return `${daysAgo} days ago`;
      }
      
      // Otherwise, return a date format
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Workouts</h2>
          <Link href="/workouts">
            <a className="text-primary text-sm font-medium">View All</a>
          </Link>
        </div>
        
        <div className="space-y-4 mt-4">
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No workouts yet. Start your fitness journey!</p>
          ) : (
            workouts.map((workout) => {
              const { icon, color } = getWorkoutIcon(workout.type);
              const formattedDuration = workout.duration 
                ? `${Math.floor(workout.duration / 60)}h ${workout.duration % 60}m`
                : '0m';
              
              return (
                <Link key={workout.id} href={`/workouts/${workout.id}`}>
                  <a className="flex p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${color}`}>
                      <span className="material-icons">{icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{workout.name}</h3>
                        <span className="text-sm text-gray-500">{formatDate(workout.date)}</span>
                      </div>
                      <div className="flex mt-1 text-sm text-gray-500">
                        <div className="flex items-center mr-4">
                          <span className="material-icons text-xs mr-1">timer</span>
                          <span>{formattedDuration}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="material-icons text-xs mr-1">fitness_center</span>
                          <span>{workout.exercises} exercises</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
