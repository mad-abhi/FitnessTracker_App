import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/context/user-context";
import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { RecentWorkouts } from "@/components/dashboard/recent-workouts";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";

export default function Workouts() {
  const { user } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: workouts, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/workouts`],
    enabled: !!user,
  });

  // Filter and group workouts
  const filteredAndGroupedWorkouts = React.useMemo(() => {
    if (!workouts) return { filtered: [], grouped: {} };
    
    const filtered = workouts.filter((workout: any) => {
      return workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             workout.type.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    // Sort by date descending
    const sorted = [...filtered].sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Add exercise count (placeholder)
    const withExerciseCount = sorted.map((workout: any) => ({
      ...workout,
      exercises: 5 // Placeholder - would be populated from workoutExercises
    }));
    
    // Group by month
    const grouped = withExerciseCount.reduce((groups: any, workout: any) => {
      const date = new Date(workout.date);
      const monthYear = format(date, 'MMMM yyyy');
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(workout);
      return groups;
    }, {});
    
    return { filtered: withExerciseCount, grouped };
  }, [workouts, searchQuery]);

  if (!user) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p>Please log in to view your workouts.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Workouts" date={format(new Date(), "EEEE, MMMM d, yyyy")} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search workouts" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <WorkoutForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-4">
                    {[1, 2].map((j) => (
                      <div key={j} className="flex p-4 border border-gray-200 rounded-lg">
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
            ))}
          </div>
        ) : filteredAndGroupedWorkouts.filtered.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No workouts yet</h3>
              <p className="text-gray-500 mb-4">Start tracking your fitness journey by creating your first workout.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <WorkoutForm />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          Object.entries(filteredAndGroupedWorkouts.grouped).map(([monthYear, monthWorkouts]: [string, any]) => (
            <Card key={monthYear}>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">{monthYear}</h3>
                <div className="space-y-4">
                  {monthWorkouts.map((workout: any) => (
                    <RecentWorkouts 
                      key={workout.id} 
                      workouts={[workout]} 
                      isLoading={false} 
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
