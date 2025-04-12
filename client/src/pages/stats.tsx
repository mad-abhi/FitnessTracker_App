import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/context/user-context";
import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkoutStats } from "@/components/stats/workout-stats";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

export default function Stats() {
  const { user } = useUserContext();
  const [timeRange, setTimeRange] = useState<string>("week");
  const [exerciseType, setExerciseType] = useState<string>("all");

  // Get the date range based on the selected time range
  const dateRange = React.useMemo(() => {
    const now = new Date();
    
    switch(timeRange) {
      case "week":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
          label: "This Week"
        };
      case "month":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: "This Month"
        };
      case "3months":
        return {
          start: subDays(now, 90),
          end: now,
          label: "Last 3 Months"
        };
      case "year":
        return {
          start: subDays(now, 365),
          end: now,
          label: "Last Year"
        };
      default:
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
          label: "This Week"
        };
    }
  }, [timeRange]);

  // Fetch workouts data
  const { data: workouts, isLoading: isLoadingWorkouts } = useQuery({
    queryKey: [`/api/users/${user?.id}/workouts`],
    enabled: !!user,
  });

  // Fetch goals data for progress comparison
  const { data: goals, isLoading: isLoadingGoals } = useQuery({
    queryKey: [`/api/users/${user?.id}/goals`],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p>Please log in to view your statistics.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Statistics" date={format(new Date(), "EEEE, MMMM d, yyyy")} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold">Performance Analytics</h2>
                <p className="text-sm text-gray-500">Track your progress over time</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={exerciseType} onValueChange={setExerciseType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Exercise type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="workouts">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="goals">Goal Progress</TabsTrigger>
              </TabsList>
              
              <WorkoutStats 
                workouts={workouts || []} 
                dateRange={dateRange}
                exerciseType={exerciseType}
                isLoading={isLoadingWorkouts}
              />
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Bests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingWorkouts ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Bench Press</p>
                      <p className="text-sm text-gray-500">Maximum weight</p>
                    </div>
                    <p className="text-lg font-bold">80 kg</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">Deadlift</p>
                      <p className="text-sm text-gray-500">Maximum weight</p>
                    </div>
                    <p className="text-lg font-bold">120 kg</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">5K Run</p>
                      <p className="text-sm text-gray-500">Best time</p>
                    </div>
                    <p className="text-lg font-bold">25:30</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingWorkouts ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <p className="font-medium">Total Workouts</p>
                    <p className="text-lg font-bold">{workouts?.length || 0}</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <p className="font-medium">Calories Burned</p>
                    <p className="text-lg font-bold">8,540</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <p className="font-medium">Active Days</p>
                    <p className="text-lg font-bold">12</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <p className="font-medium">Avg. Workout Duration</p>
                    <p className="text-lg font-bold">45 min</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
