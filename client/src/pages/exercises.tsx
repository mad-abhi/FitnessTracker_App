import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { format } from "date-fns";
import { Search } from "lucide-react";

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['/api/exercises'],
  });

  // Filter and group exercises by muscle group
  const filteredAndGroupedExercises = React.useMemo(() => {
    if (!exercises) return { filtered: [], muscleGroups: {} };
    
    const filtered = exercises.filter((exercise: any) => {
      if (activeTab !== "all" && exercise.muscleGroups) {
        const muscleGroups = exercise.muscleGroups.toLowerCase().split(", ");
        if (!muscleGroups.includes(activeTab.toLowerCase())) {
          return false;
        }
      }
      
      return exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (exercise.muscleGroups && exercise.muscleGroups.toLowerCase().includes(searchQuery.toLowerCase())) ||
             (exercise.description && exercise.description.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    
    // Group exercises by primary muscle group
    const muscleGroups: Record<string, any[]> = {};
    
    filtered.forEach((exercise: any) => {
      if (!exercise.muscleGroups) return;
      
      const primaryMuscleGroup = exercise.muscleGroups.split(", ")[0];
      
      if (!muscleGroups[primaryMuscleGroup]) {
        muscleGroups[primaryMuscleGroup] = [];
      }
      
      muscleGroups[primaryMuscleGroup].push(exercise);
    });
    
    return { filtered, muscleGroups };
  }, [exercises, searchQuery, activeTab]);

  // Extract unique muscle groups for tabs
  const uniqueMuscleGroups = React.useMemo(() => {
    if (!exercises) return [];
    
    const allGroups = new Set<string>();
    
    exercises.forEach((exercise: any) => {
      if (exercise.muscleGroups) {
        exercise.muscleGroups.split(", ").forEach((group: string) => {
          allGroups.add(group);
        });
      }
    });
    
    return Array.from(allGroups).sort();
  }, [exercises]);

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Exercise Library" date={format(new Date(), "EEEE, MMMM d, yyyy")} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search exercises" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex overflow-x-auto pb-2 mb-2 w-full justify-start">
                <TabsTrigger value="all">All</TabsTrigger>
                {uniqueMuscleGroups.map((group) => (
                  <TabsTrigger key={group} value={group.toLowerCase()}>
                    {group}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64">
                <div className="h-40 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndGroupedExercises.filtered.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No exercises found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndGroupedExercises.filtered.map((exercise: any) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
