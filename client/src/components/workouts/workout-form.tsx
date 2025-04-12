import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertWorkoutSchema, insertWorkoutExerciseSchema } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useUserContext } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";

const workoutSchema = insertWorkoutSchema.extend({
  name: z.string().min(1, "Workout name is required"),
  type: z.string().min(1, "Workout type is required"),
  date: z.string().default(() => new Date().toISOString()),
  userId: z.number(),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

const workoutExerciseSchema = insertWorkoutExerciseSchema.extend({
  exerciseId: z.number().min(1, "Exercise is required"),
  sets: z.number().min(1, "At least 1 set is required"),
  reps: z.number().min(1, "At least 1 rep is required"),
  weight: z.number().optional(),
});

type WorkoutExerciseFormValues = z.infer<typeof workoutExerciseSchema>;

interface WorkoutExercise {
  id?: number;
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
}

export function WorkoutForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

  const { data: exercises, isLoading: isLoadingExercises } = useQuery({
    queryKey: ['/api/exercises'],
  });

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: "",
      type: "Strength Training",
      date: new Date().toISOString(),
      userId: user?.id || 0,
    },
  });

  const exerciseForm = useForm<WorkoutExerciseFormValues>({
    resolver: zodResolver(workoutExerciseSchema),
    defaultValues: {
      exerciseId: 0,
      sets: 3,
      reps: 10,
      weight: undefined,
    },
  });

  const workoutMutation = useMutation({
    mutationFn: async (data: WorkoutFormValues) => {
      if (!user) throw new Error("User not authenticated");
      
      // Create the workout
      const response = await apiRequest("POST", "/api/workouts", {
        ...data,
        userId: user.id,
      });
      const workout = await response.json();
      
      // Create workout exercises
      for (const exercise of selectedExercises) {
        await apiRequest("POST", "/api/workout-exercises", {
          workoutId: workout.id,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
        });
      }
      
      return workout;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Workout has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/workouts`] });
      form.reset();
      setSelectedExercises([]);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to create workout",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WorkoutFormValues) => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Warning",
        description: "Please add at least one exercise to your workout",
        variant: "destructive",
      });
      return;
    }
    
    workoutMutation.mutate(data);
  };

  const addExercise = (data: WorkoutExerciseFormValues) => {
    const exercise = exercises?.find((e: any) => e.id === data.exerciseId);
    if (!exercise) return;

    if (editingExerciseIndex !== null) {
      // Update existing exercise
      const updatedExercises = [...selectedExercises];
      updatedExercises[editingExerciseIndex] = {
        ...updatedExercises[editingExerciseIndex],
        exerciseId: data.exerciseId,
        exerciseName: exercise.name,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
      };
      setSelectedExercises(updatedExercises);
      setEditingExerciseIndex(null);
    } else {
      // Add new exercise
      setSelectedExercises([
        ...selectedExercises,
        {
          exerciseId: data.exerciseId,
          exerciseName: exercise.name,
          sets: data.sets,
          reps: data.reps,
          weight: data.weight,
        },
      ]);
    }

    exerciseForm.reset();
    setShowExerciseForm(false);
  };

  const editExercise = (index: number) => {
    const exercise = selectedExercises[index];
    exerciseForm.reset({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
    });
    setEditingExerciseIndex(index);
    setShowExerciseForm(true);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  if (!user) return <div>Please log in to create a workout</div>;

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Start New Workout</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Workout" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a workout type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Strength Training">Strength Training</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Flexibility">Flexibility</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <div className="flex justify-between mb-1">
              <FormLabel>Exercises</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary text-xs font-medium"
                onClick={() => {
                  exerciseForm.reset({
                    exerciseId: 0,
                    sets: 3,
                    reps: 10,
                    weight: undefined,
                  });
                  setEditingExerciseIndex(null);
                  setShowExerciseForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Exercise
              </Button>
            </div>

            {selectedExercises.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-3 border border-dashed border-gray-200 rounded-md">
                No exercises added yet
              </p>
            ) : (
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">{exercise.exerciseName}</span>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-gray-500"
                          onClick={() => editExercise(index)}
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          type="button"
                          className="text-gray-500"
                          onClick={() => removeExercise(index)}
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight ? ` @ ${exercise.weight} kg` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            {/* Dialog will handle the cancel button */}
            <Button type="submit" disabled={workoutMutation.isPending}>
              {workoutMutation.isPending ? "Creating..." : "Start Workout"}
            </Button>
          </div>
        </form>
      </Form>

      {showExerciseForm && (
        <Dialog open={showExerciseForm} onOpenChange={setShowExerciseForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingExerciseIndex !== null ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
            </DialogHeader>
            <Form {...exerciseForm}>
              <form onSubmit={exerciseForm.handleSubmit(addExercise)} className="space-y-4">
                <FormField
                  control={exerciseForm.control}
                  name="exerciseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an exercise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {exercises?.map((exercise: any) => (
                            <SelectItem key={exercise.id} value={exercise.id.toString()}>
                              {exercise.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={exerciseForm.control}
                    name="sets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sets</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exerciseForm.control}
                    name="reps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reps</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exerciseForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowExerciseForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingExerciseIndex !== null ? "Update Exercise" : "Add Exercise"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
