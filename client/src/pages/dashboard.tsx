import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/context/user-context";
import { DashboardHeader } from "@/components/layout/header";
import { WeeklySummary } from "@/components/dashboard/weekly-summary";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { RecentWorkouts } from "@/components/dashboard/recent-workouts";
import { ExerciseLibrary } from "@/components/dashboard/exercise-library";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useUserContext();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: [`/api/users/${user?.id}/goals`],
    enabled: !!user,
  });

  const { data: workouts, isLoading: isLoadingWorkouts } = useQuery({
    queryKey: [`/api/users/${user?.id}/workouts`],
    enabled: !!user,
  });

  const { data: exercises, isLoading: isLoadingExercises } = useQuery({
    queryKey: ['/api/exercises'],
  });

  // Data processing for summary stats
  const workoutStats = React.useMemo(() => {
    if (!workouts || workouts.length === 0) {
      return {
        workoutsThisWeek: 0,
        totalTime: "0h 0m",
        caloriesBurned: 0
      };
    }

    // Get workouts from the last 7 days
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentWorkouts = workouts.filter((workout: any) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= oneWeekAgo && workoutDate <= now;
    });
    
    // Calculate total time
    const totalMinutes = recentWorkouts.reduce((total: number, workout: any) => {
      return total + (workout.duration || 0);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // Estimate calories (very rough estimate: 7-10 calories per minute)
    const caloriesBurned = totalMinutes * 8;
    
    return {
      workoutsThisWeek: recentWorkouts.length,
      totalTime: `${hours}h ${minutes}m`,
      caloriesBurned
    };
  }, [workouts]);

  // Process workouts for the recent workouts component
  const recentWorkouts = React.useMemo(() => {
    if (!workouts) return [];
    
    // Sort by date descending
    return workouts
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map((workout: any) => ({
        ...workout,
        exercises: 5 // This is a placeholder - ideally we'd get this from the workout exercises relation
      }));
  }, [workouts]);

  // Get a sample of exercises for the library
  const topExercises = React.useMemo(() => {
    if (!exercises) return [];
    return exercises.slice(0, 3);
  }, [exercises]);

  if (!user) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Dashboard" date={today} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <WeeklySummary 
          workouts={workoutStats.workoutsThisWeek}
          totalTime={workoutStats.totalTime}
          calories={workoutStats.caloriesBurned}
        />
        
        <GoalsProgress goals={goals || []} isLoading={isLoadingGoals} />
        
        <RecentWorkouts workouts={recentWorkouts} isLoading={isLoadingWorkouts} />
        
        <ExerciseLibrary exercises={topExercises} isLoading={isLoadingExercises} />
      </div>
    </div>
  );
}
