import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema, insertExerciseSchema, insertWorkoutSchema, insertWorkoutExerciseSchema, insertGoalSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid user data", errors: validatedData.error.format() });
      }

      const existingUser = await storage.getUserByUsername(validatedData.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(validatedData.data);
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.status(200).json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exercises" });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exercise = await storage.getExercise(Number(req.params.id));
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(200).json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Error fetching exercise" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const validatedData = insertExerciseSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid exercise data", errors: validatedData.error.format() });
      }

      const exercise = await storage.createExercise(validatedData.data);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Error creating exercise" });
    }
  });

  app.put("/api/exercises/:id", async (req, res) => {
    try {
      const validatedData = insertExerciseSchema.partial().safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid exercise data", errors: validatedData.error.format() });
      }

      const exercise = await storage.updateExercise(Number(req.params.id), validatedData.data);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(200).json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Error updating exercise" });
    }
  });

  app.delete("/api/exercises/:id", async (req, res) => {
    try {
      const success = await storage.deleteExercise(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting exercise" });
    }
  });

  // Workout routes
  app.get("/api/users/:userId/workouts", async (req, res) => {
    try {
      const workouts = await storage.getWorkoutsByUserId(Number(req.params.userId));
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workouts" });
    }
  });

  app.get("/api/workouts/:id", async (req, res) => {
    try {
      const workout = await storage.getWorkout(Number(req.params.id));
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workout" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const validatedData = insertWorkoutSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid workout data", errors: validatedData.error.format() });
      }

      const workout = await storage.createWorkout(validatedData.data);
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ message: "Error creating workout" });
    }
  });

  app.put("/api/workouts/:id", async (req, res) => {
    try {
      const validatedData = insertWorkoutSchema.partial().safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid workout data", errors: validatedData.error.format() });
      }

      const workout = await storage.updateWorkout(Number(req.params.id), validatedData.data);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ message: "Error updating workout" });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const success = await storage.deleteWorkout(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting workout" });
    }
  });

  // WorkoutExercise routes
  app.get("/api/workouts/:workoutId/exercises", async (req, res) => {
    try {
      const workoutExercises = await storage.getWorkoutExercisesByWorkoutId(Number(req.params.workoutId));
      
      // Enrich with exercise details
      const enrichedWorkoutExercises = await Promise.all(
        workoutExercises.map(async (we) => {
          const exercise = await storage.getExercise(we.exerciseId);
          return {
            ...we,
            exercise
          };
        })
      );
      
      res.status(200).json(enrichedWorkoutExercises);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workout exercises" });
    }
  });

  app.post("/api/workout-exercises", async (req, res) => {
    try {
      const validatedData = insertWorkoutExerciseSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid workout exercise data", errors: validatedData.error.format() });
      }

      const workoutExercise = await storage.createWorkoutExercise(validatedData.data);
      res.status(201).json(workoutExercise);
    } catch (error) {
      res.status(500).json({ message: "Error creating workout exercise" });
    }
  });

  app.put("/api/workout-exercises/:id", async (req, res) => {
    try {
      const validatedData = insertWorkoutExerciseSchema.partial().safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid workout exercise data", errors: validatedData.error.format() });
      }

      const workoutExercise = await storage.updateWorkoutExercise(Number(req.params.id), validatedData.data);
      if (!workoutExercise) {
        return res.status(404).json({ message: "Workout exercise not found" });
      }
      res.status(200).json(workoutExercise);
    } catch (error) {
      res.status(500).json({ message: "Error updating workout exercise" });
    }
  });

  app.delete("/api/workout-exercises/:id", async (req, res) => {
    try {
      const success = await storage.deleteWorkoutExercise(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Workout exercise not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting workout exercise" });
    }
  });

  // Goal routes
  app.get("/api/users/:userId/goals", async (req, res) => {
    try {
      const goals = await storage.getGoalsByUserId(Number(req.params.userId));
      res.status(200).json(goals);
    } catch (error) {
      res.status(500).json({ message: "Error fetching goals" });
    }
  });

  app.get("/api/goals/:id", async (req, res) => {
    try {
      const goal = await storage.getGoal(Number(req.params.id));
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ message: "Error fetching goal" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid goal data", errors: validatedData.error.format() });
      }

      const goal = await storage.createGoal(validatedData.data);
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ message: "Error creating goal" });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const validatedData = insertGoalSchema.partial().safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid goal data", errors: validatedData.error.format() });
      }

      const goal = await storage.updateGoal(Number(req.params.id), validatedData.data);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(200).json(goal);
    } catch (error) {
      res.status(500).json({ message: "Error updating goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const success = await storage.deleteGoal(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting goal" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
