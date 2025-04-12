import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertGoalSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useUserContext } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const goalSchema = insertGoalSchema.extend({
  title: z.string().min(1, "Goal title is required"),
  description: z.string().optional(),
  targetValue: z.number().min(0.1, "Target value must be greater than 0"),
  currentValue: z.number().min(0, "Current value must be at least 0"),
  unit: z.string().min(1, "Unit is required"),
  type: z.string().min(1, "Goal type is required"),
  deadline: z.string().optional(),
  userId: z.number(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export function GoalForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useUserContext();
  const { toast } = useToast();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      targetValue: 1,
      currentValue: 0,
      unit: "kg",
      type: "strength",
      deadline: undefined,
      completed: false,
      userId: user?.id || 0,
    },
  });

  const goalMutation = useMutation({
    mutationFn: async (data: GoalFormValues) => {
      if (!user) throw new Error("User not authenticated");
      
      const response = await apiRequest("POST", "/api/goals", {
        ...data,
        userId: user.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Goal has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/goals`] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    goalMutation.mutate(data);
  };

  if (!user) return <div>Please log in to create a goal</div>;

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create New Goal</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bench Press 100kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add details about your goal" {...field} />
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
                <FormLabel>Goal Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="workout">Weekly Workouts</SelectItem>
                    <SelectItem value="weight">Body Weight</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="targetValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="reps">Repetitions</SelectItem>
                    <SelectItem value="km">Kilometers (km)</SelectItem>
                    <SelectItem value="miles">Miles</SelectItem>
                    <SelectItem value="min">Minutes</SelectItem>
                    <SelectItem value="workouts">Workouts</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="submit" disabled={goalMutation.isPending}>
              {goalMutation.isPending ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
