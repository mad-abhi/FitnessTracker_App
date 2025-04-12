import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Exercise } from "@shared/schema";

interface ExerciseLibraryProps {
  exercises: Exercise[];
  isLoading?: boolean;
}

export function ExerciseLibrary({ exercises, isLoading = false }: ExerciseLibraryProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Exercise Library</h2>
            <Link href="/exercises">
              <a className="text-primary text-sm font-medium">Browse All</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mt-3"></div>
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
          <h2 className="text-lg font-semibold">Exercise Library</h2>
          <Link href="/exercises">
            <a className="text-primary text-sm font-medium">Browse All</a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {exercises.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center py-4">No exercises available. Add your first exercise!</p>
          ) : (
            exercises.map((exercise) => (
              <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                <a className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gray-200 relative">
                    <img 
                      src={exercise.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"} 
                      alt={exercise.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{exercise.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{exercise.muscleGroups}</p>
                    <div className="flex items-center text-xs text-primary font-medium cursor-pointer">
                      <span>View Details</span>
                      <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </div>
                  </div>
                </a>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
