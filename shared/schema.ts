import { pgTable, text, serial, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  profilePicture: text("profile_picture"),
});

// Exercise model
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  muscleGroups: text("muscle_groups"),
  imageUrl: text("image_url"),
});

// Workout model
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users table
  name: text("name").notNull(),
  type: text("type").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // in minutes
  notes: text("notes"),
});

// WorkoutExercise model (join table between workouts and exercises)
export const workoutExercises = pgTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(), // Foreign key to workouts table
  exerciseId: integer("exercise_id").notNull(), // Foreign key to exercises table
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  weight: real("weight"), // in kg
  duration: integer("duration"), // in seconds (for timed exercises)
  notes: text("notes"),
});

// Goal model
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users table
  title: text("title").notNull(),
  description: text("description"),
  targetValue: real("target_value").notNull(),
  currentValue: real("current_value").notNull(),
  unit: text("unit").notNull(), // e.g., kg, reps, km, etc.
  deadline: timestamp("deadline"),
  completed: boolean("completed").notNull().default(false),
  type: text("type").notNull(), // workout, exercise, weight, etc.
});

// Define schemas for insert operations
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profilePicture: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  name: true,
  description: true,
  muscleGroups: true,
  imageUrl: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  userId: true,
  name: true,
  type: true,
  date: true,
  duration: true,
  notes: true,
});

export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).pick({
  workoutId: true,
  exerciseId: true,
  sets: true,
  reps: true,
  weight: true,
  duration: true,
  notes: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  title: true,
  description: true,
  targetValue: true,
  currentValue: true,
  unit: true,
  deadline: true,
  completed: true,
  type: true,
});

// Define types for the entities
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
