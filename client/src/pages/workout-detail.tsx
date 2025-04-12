import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { format, parseISO } from "date-fns";
import { ArrowLeft, CalendarIcon, ClockIcon, Pencil, Plus, Trash2 } from "lucide-react";

export default function WorkoutDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: workout, isLoading: isLoadingWorkout } = useQuery({
    queryKey: [`/api/workouts/${id}`],
    enabled: !!id,
  });

  const { data: workoutExercises, isLoading: isLoadingExercises } = useQuery({
    queryKey: [`/api/workouts/${id}/exercises`],
    enabled: !!id,
  });

  if (isLoadingWorkout || isLoadingExercises) {
    return (
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title="Workout Details" date="" />
        
        <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/workouts")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workouts
          </Button>
          
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title="Workout Not Found" date="" />
        
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/workouts")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workouts
          </Button>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Workout not found</h3>
              <p className="text-gray-500 mb-4">The workout you're looking for doesn't seem to exist.</p>
              <Button onClick={() => setLocation("/workouts")}>
                Browse Workouts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Format workout duration
  const formattedDuration = workout.duration 
    ? `${Math.floor(workout.duration / 60)}h ${workout.duration % 60}m`
    : '0m';

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Workout Details" date="" />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/workouts")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workouts
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{workout.name}</CardTitle>
                <CardDescription>
                  <div className="flex mt-2">
                    <div className="flex items-center mr-4">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {format(parseISO(workout.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-500">{formattedDuration}</span>
                    </div>
                  </div>
                </CardDescription>
              </div>
              <div className="flex">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-primary bg-opacity-10 text-primary rounded-lg px-4 py-3 mb-6 inline-block">
              {workout.type}
            </div>
            
            {workout.notes && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-gray-600">{workout.notes}</p>
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Exercises</h3>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Plus className="h-4 w-4 mr-1" /> Add Exercise
                </Button>
              </div>
              
              {workoutExercises && workoutExercises.length > 0 ? (
                <div className="space-y-4">
                  {workoutExercises.map((item: any) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{item.exercise?.name || "Unknown Exercise"}</h4>
                            <p className="text-sm text-gray-500">{item.exercise?.muscleGroups}</p>
                          </div>
                          <div className="flex">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex mt-2 space-x-6">
                          <div>
                            <span className="text-xs text-gray-500">Sets</span>
                            <p className="font-medium">{item.sets}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Reps</span>
                            <p className="font-medium">{item.reps}</p>
                          </div>
                          {item.weight && (
                            <div>
                              <span className="text-xs text-gray-500">Weight</span>
                              <p className="font-medium">{item.weight} kg</p>
                            </div>
                          )}
                          {item.duration && (
                            <div>
                              <span className="text-xs text-gray-500">Duration</span>
                              <p className="font-medium">{item.duration} sec</p>
                            </div>
                          )}
                        </div>
                        {item.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="text-xs text-gray-500 block">Notes</span>
                            {item.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">No exercises added to this workout yet.</p>
                    <Button>Add Your First Exercise</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Delete Workout</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Repeat Workout</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <WorkoutForm />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
