import React from "react";
import { useLocation } from "wouter";
import { useUserContext } from "@/context/user-context";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const { user } = useUserContext();
  const { toast } = useToast();

  // List of routes that don't require authentication
  const publicRoutes = ["/auth"];

  // Check if current route requires authentication
  const requiresAuth = !publicRoutes.includes(location);

  // Redirect to login if the route requires authentication and the user is not logged in
  if (requiresAuth && !user) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive",
    });
    return <Redirect to="/auth" />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {user && <Sidebar />}
      <main className="flex-1 flex flex-col">
        {user && <Header />}
        {children}
        {user && <MobileNav />}
      </main>
    </div>
  );
};

export default Layout;
