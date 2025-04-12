import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/context/user-context";
import { DashboardHeader } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GoalProgress } from "@/components/goals/goal-progress";
import { GoalForm } from "@/components/goals/goal-form";
import { format } from "date-fns";
import { Plus } from "lucide-react";

export default function Goals() {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: goals, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/goals`],
    enabled: !!user,
  });

  // Filter and group goals
  const filteredGoals = React.useMemo(() => {
    if (!goals) return { active: [], completed: [] };
    
    const filtered = goals.filter((goal: any) => {
      if (activeTab === "all") return true;
      if (activeTab === "completed") return goal.completed;
      if (activeTab === "active") return !goal.completed;
      return goal.type === activeTab;
    });
    
    // Separate active and completed goals
    const active = filtered.filter((goal: any) => !goal.completed);
    const completed = filtered.filter((goal: any) => goal.completed);
    
    return { active, completed };
  }, [goals, activeTab]);

  if (!user) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p>Please log in to view your goals.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title="Goals" date={format(new Date(), "EEEE, MMMM d, yyyy")} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold">Your Fitness Goals</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <GoalForm />
                </DialogContent>
              </Dialog>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="strength">Strength</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mr-6"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredGoals.active.length === 0 && filteredGoals.completed.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="text-gray-500 mb-4">
                {activeTab === "all" 
                  ? "Start by creating your first fitness goal." 
                  : "No goals match your current filter."}
              </p>
              {activeTab === "all" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <GoalForm />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredGoals.active.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Active Goals</h3>
                {filteredGoals.active.map((goal: any) => (
                  <GoalProgress key={goal.id} goal={goal} />
                ))}
              </div>
            )}
            
            {filteredGoals.completed.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Completed Goals</h3>
                {filteredGoals.completed.map((goal: any) => (
                  <GoalProgress key={goal.id} goal={goal} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
