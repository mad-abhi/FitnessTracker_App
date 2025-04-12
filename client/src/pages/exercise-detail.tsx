import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { ArrowLeft, Clock, Dumbbell, Zap } from "lucide-react";

export default function ExerciseDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: exercise, isLoading } = useQuery({
    queryKey: [`/api/exercises/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title="Exercise Details" date="" />
        
        <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/exercises")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exercises
          </Button>
          
          <div className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title="Exercise Not Found" date="" />
        
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/exercises")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exercises
          </Button>
          
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Exercise not found</h3>
              <p className="text-gray-500 mb-4">The exercise you're looking for doesn't seem to exist.</p>
              <Button onClick={() => setLocation("/exercises")}>
                Browse Exercises
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Exercise Details" date="" />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/exercises")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exercises
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="h-80 bg-gray-200 relative">
                <img 
                  src={exercise.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl">{exercise.name}</CardTitle>
                <CardDescription>{exercise.muscleGroups}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <Dumbbell className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Strength</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <Clock className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm font-medium">45-60 sec</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                    <Zap className="h-6 w-6 text-secondary mb-2" />
                    <span className="text-sm font-medium">Intermediate</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h3>Description</h3>
                  <p>{exercise.description || "No description available for this exercise."}</p>
                  
                  <h3 className="mt-6">How to perform</h3>
                  <ol>
                    <li>Start by positioning yourself correctly on the bench/equipment.</li>
                    <li>Maintain proper form throughout the movement.</li>
                    <li>Focus on controlled movements rather than momentum.</li>
                    <li>Remember to breathe properly during the exercise.</li>
                    <li>Complete your desired number of repetitions and sets.</li>
                  </ol>
                  
                  <h3 className="mt-6">Tips</h3>
                  <ul>
                    <li>Focus on maintaining proper form to prevent injuries.</li>
                    <li>Start with lighter weights to perfect your technique.</li>
                    <li>Gradually increase weight as you build strength.</li>
                    <li>Ensure adequate rest between sets for optimal performance.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add to Workout</CardTitle>
                <CardDescription>Include this exercise in your next workout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Create New Workout</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <WorkoutForm />
                  </DialogContent>
                </Dialog>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">Add to Existing Workout</Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Related Exercises</CardTitle>
                <CardDescription>Similar exercises you might like</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80" 
                      alt="Dumbbell Rows"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Dumbbell Rows</h4>
                    <p className="text-sm text-gray-500">Back, Biceps</p>
                  </div>
                </div>
                
                <div className="flex items-center border-b pb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1598971639058-efc302d5704b?w=600&auto=format&fit=crop&q=80" 
                      alt="Pull-ups"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Pull-ups</h4>
                    <p className="text-sm text-gray-500">Back, Biceps, Shoulders</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1598575285675-d0d3d0358e55?w=600&auto=format&fit=crop&q=80" 
                      alt="Overhead Press" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Overhead Press</h4>
                    <p className="text-sm text-gray-500">Shoulders, Triceps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
