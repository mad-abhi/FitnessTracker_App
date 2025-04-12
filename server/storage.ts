import { 
  users, type User, type InsertUser,
  exercises, type Exercise, type InsertExercise,
  workouts, type Workout, type InsertWorkout,
  workoutExercises, type WorkoutExercise, type InsertWorkoutExercise,
  goals, type Goal, type InsertGoal
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Exercise operations
  getExercise(id: number): Promise<Exercise | undefined>;
  getExercises(): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, exercise: Partial<InsertExercise>): Promise<Exercise | undefined>;
  deleteExercise(id: number): Promise<boolean>;
  
  // Workout operations
  getWorkout(id: number): Promise<Workout | undefined>;
  getWorkoutsByUserId(userId: number): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;
  
  // WorkoutExercise operations
  getWorkoutExercise(id: number): Promise<WorkoutExercise | undefined>;
  getWorkoutExercisesByWorkoutId(workoutId: number): Promise<WorkoutExercise[]>;
  createWorkoutExercise(workoutExercise: InsertWorkoutExercise): Promise<WorkoutExercise>;
  updateWorkoutExercise(id: number, workoutExercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined>;
  deleteWorkoutExercise(id: number): Promise<boolean>;
  
  // Goal operations
  getGoal(id: number): Promise<Goal | undefined>;
  getGoalsByUserId(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  private workouts: Map<number, Workout>;
  private workoutExercises: Map<number, WorkoutExercise>;
  private goals: Map<number, Goal>;
  
  private userCurrentId: number;
  private exerciseCurrentId: number;
  private workoutCurrentId: number;
  private workoutExerciseCurrentId: number;
  private goalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.workouts = new Map();
    this.workoutExercises = new Map();
    this.goals = new Map();
    
    this.userCurrentId = 1;
    this.exerciseCurrentId = 1;
    this.workoutCurrentId = 1;
    this.workoutExerciseCurrentId = 1;
    this.goalCurrentId = 1;
    
    // Add default exercises
    this.seedExercises();
  }

  // Seed some default exercises
  private seedExercises() {
    const defaultExercises: InsertExercise[] = [
      {
        name: "Bench Press",
        description: "A compound exercise that primarily targets the chest muscles, but also engages the shoulders and triceps.",
        muscleGroups: "Chest, Triceps, Shoulders",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Deadlift",
        description: "A compound exercise that works the entire posterior chain, including the lower back, glutes, and hamstrings.",
        muscleGroups: "Back, Hamstrings, Glutes",
        imageUrl: "https://images.unsplash.com/photo-1600026453249-be3e4f44e7f0?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Squat",
        description: "A fundamental compound exercise that primarily targets the quads, glutes, and core.",
        muscleGroups: "Quads, Glutes, Core",
        imageUrl: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Dumbbell Rows",
        description: "An isolation exercise that targets the upper back and lats.",
        muscleGroups: "Back, Biceps",
        imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Overhead Press",
        description: "A compound exercise that primarily targets the shoulders but also engages the triceps and upper chest.",
        muscleGroups: "Shoulders, Triceps",
        imageUrl: "https://images.unsplash.com/photo-1598575285675-d0d3d0358e55?w=600&auto=format&fit=crop&q=80"
      },
      {
        name: "Pull-ups",
        description: "A compound bodyweight exercise that targets the back, biceps, and shoulders.",
        muscleGroups: "Back, Biceps, Shoulders",
        imageUrl: "https://images.unsplash.com/photo-1598971639058-efc302d5704b?w=600&auto=format&fit=crop&q=80"
      }
    ];

    defaultExercises.forEach(exercise => {
      this.createExercise(exercise);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Exercise operations
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseCurrentId++;
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async updateExercise(id: number, exercise: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const existingExercise = this.exercises.get(id);
    if (!existingExercise) return undefined;
    
    const updatedExercise = { ...existingExercise, ...exercise };
    this.exercises.set(id, updatedExercise);
    return updatedExercise;
  }

  async deleteExercise(id: number): Promise<boolean> {
    return this.exercises.delete(id);
  }

  // Workout operations
  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getWorkoutsByUserId(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.userId === userId
    );
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = this.workoutCurrentId++;
    const workout: Workout = { ...insertWorkout, id };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const existingWorkout = this.workouts.get(id);
    if (!existingWorkout) return undefined;
    
    const updatedWorkout = { ...existingWorkout, ...workout };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    return this.workouts.delete(id);
  }

  // WorkoutExercise operations
  async getWorkoutExercise(id: number): Promise<WorkoutExercise | undefined> {
    return this.workoutExercises.get(id);
  }

  async getWorkoutExercisesByWorkoutId(workoutId: number): Promise<WorkoutExercise[]> {
    return Array.from(this.workoutExercises.values()).filter(
      (workoutExercise) => workoutExercise.workoutId === workoutId
    );
  }

  async createWorkoutExercise(insertWorkoutExercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const id = this.workoutExerciseCurrentId++;
    const workoutExercise: WorkoutExercise = { ...insertWorkoutExercise, id };
    this.workoutExercises.set(id, workoutExercise);
    return workoutExercise;
  }

  async updateWorkoutExercise(id: number, workoutExercise: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const existingWorkoutExercise = this.workoutExercises.get(id);
    if (!existingWorkoutExercise) return undefined;
    
    const updatedWorkoutExercise = { ...existingWorkoutExercise, ...workoutExercise };
    this.workoutExercises.set(id, updatedWorkoutExercise);
    return updatedWorkoutExercise;
  }

  async deleteWorkoutExercise(id: number): Promise<boolean> {
    return this.workoutExercises.delete(id);
  }

  // Goal operations
  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async getGoalsByUserId(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.userId === userId
    );
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = this.goalCurrentId++;
    const goal: Goal = { ...insertGoal, id };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const existingGoal = this.goals.get(id);
    if (!existingGoal) return undefined;
    
    const updatedGoal = { ...existingGoal, ...goal };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<boolean> {
    return this.goals.delete(id);
  }
}

export const storage = new MemStorage();
