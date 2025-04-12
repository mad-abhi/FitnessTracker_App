import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { format, isWithinInterval, parseISO } from "date-fns";

interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

interface WorkoutStatsProps {
  workouts: any[];
  dateRange: DateRange;
  exerciseType: string;
  isLoading: boolean;
}

export function WorkoutStats({ workouts, dateRange, exerciseType, isLoading }: WorkoutStatsProps) {
  // Filter workouts by date range and exercise type
  const filteredWorkouts = React.useMemo(() => {
    return workouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      const isInRange = isWithinInterval(workoutDate, { start: dateRange.start, end: dateRange.end });
      const matchesType = exerciseType === "all" || workout.type.toLowerCase() === exerciseType.toLowerCase();
      return isInRange && matchesType;
    });
  }, [workouts, dateRange, exerciseType]);

  // Prepare data for charts
  const workoutsByDay = React.useMemo(() => {
    const days: Record<string, { day: string, count: number, duration: number }> = {};
    
    filteredWorkouts.forEach(workout => {
      const day = format(parseISO(workout.date), "EEE");
      if (!days[day]) {
        days[day] = { day, count: 0, duration: 0 };
      }
      days[day].count += 1;
      days[day].duration += workout.duration || 0;
    });
    
    // Sort by day of week
    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return dayOrder.map(day => days[day] || { day, count: 0, duration: 0 });
  }, [filteredWorkouts]);

  // Workout types distribution
  const workoutTypeDistribution = React.useMemo(() => {
    const types: Record<string, number> = {};
    
    filteredWorkouts.forEach(workout => {
      const type = workout.type;
      if (!types[type]) {
        types[type] = 0;
      }
      types[type] += 1;
    });
    
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [filteredWorkouts]);

  if (isLoading) {
    return (
      <TabsContent value="workouts" className="mt-4">
        <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
      </TabsContent>
    );
  }

  return (
    <>
      <TabsContent value="workouts" className="mt-4">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Workout Frequency - {dateRange.label}</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workoutsByDay}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Workouts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Workout Duration - {dateRange.label}</h3>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={workoutsByDay}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="duration" stroke="hsl(var(--secondary))" name="Minutes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Workout Types - {dateRange.label}</h3>
                <div className="h-60">
                  {workoutTypeDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={workoutTypeDistribution}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--accent))" name="Workouts" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No workout data available for the selected period
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Statistics Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <span className="block text-2xl font-bold">{filteredWorkouts.length}</span>
                  <span className="text-sm text-gray-500">Total Workouts</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <span className="block text-2xl font-bold">
                    {workoutsByDay.filter(day => day.count > 0).length}
                  </span>
                  <span className="text-sm text-gray-500">Active Days</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <span className="block text-2xl font-bold">
                    {Math.round(filteredWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0) / 
                    Math.max(1, filteredWorkouts.length))}
                  </span>
                  <span className="text-sm text-gray-500">Avg Minutes</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <span className="block text-2xl font-bold">
                    {workoutTypeDistribution.length}
                  </span>
                  <span className="text-sm text-gray-500">Workout Types</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="exercises" className="mt-4">
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
          <div className="text-center">
            <h3 className="font-medium mb-2">Exercise Analytics</h3>
            <p className="text-gray-500">Exercise specific analytics will appear here</p>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="goals" className="mt-4">
        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
          <div className="text-center">
            <h3 className="font-medium mb-2">Goal Progress Analytics</h3>
            <p className="text-gray-500">Goal progress charts will appear here</p>
          </div>
        </div>
      </TabsContent>
    </>
  );
}
