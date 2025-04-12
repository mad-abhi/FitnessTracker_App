import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Exercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link href={`/exercises/${exercise.id}`}>
      <a className="block">
        <Card className="overflow-hidden h-full hover:shadow-md transition">
          <div className="h-40 bg-gray-200 relative">
            <img 
              src={exercise.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"} 
              alt={exercise.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-1">{exercise.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{exercise.muscleGroups}</p>
            <div className="flex items-center text-xs text-primary font-medium cursor-pointer">
              <span>View Details</span>
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
