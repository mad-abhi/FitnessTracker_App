import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("fittrack-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user", error);
        localStorage.removeItem("fittrack-user");
      }
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string, password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data);
      localStorage.setItem("fittrack-user", JSON.stringify(data));
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, password, name }: { username: string, password: string, name: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", { username, password, name });
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data);
      localStorage.setItem("fittrack-user", JSON.stringify(data));
      toast({
        title: "Registration successful!",
        description: "Your account has been created",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (username: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ username, password, name });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fittrack-user");
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading: loginMutation.isPending || registerMutation.isPending,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
