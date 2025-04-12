import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./context/user-context";
import Layout from "./components/layout/layout";

// Pages
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Exercises from "@/pages/exercises";
import Goals from "@/pages/goals";
import Stats from "@/pages/stats";
import Profile from "@/pages/profile";
import ExerciseDetail from "@/pages/exercise-detail";
import WorkoutDetail from "@/pages/workout-detail";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/workouts" component={Workouts} />
        <Route path="/workouts/:id" component={WorkoutDetail} />
        <Route path="/exercises" component={Exercises} />
        <Route path="/exercises/:id" component={ExerciseDetail} />
        <Route path="/goals" component={Goals} />
        <Route path="/stats" component={Stats} />
        <Route path="/profile" component={Profile} />
        <Route path="/auth" component={Auth} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router />
        <Toaster />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
