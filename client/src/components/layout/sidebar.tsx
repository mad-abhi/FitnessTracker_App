import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/context/user-context";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useUserContext();

  if (!user) return null;
  
  return (
    <aside className={cn("hidden lg:flex flex-col w-64 bg-white border-r border-gray-200", className)}>
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">FitTrack</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <NavLink href="/dashboard" current={location} icon="dashboard">
          Dashboard
        </NavLink>
        <NavLink href="/workouts" current={location} icon="fitness_center">
          Workouts
        </NavLink>
        <NavLink href="/exercises" current={location} icon="directions_run">
          Exercises
        </NavLink>
        <NavLink href="/goals" current={location} icon="flag">
          Goals
        </NavLink>
        <NavLink href="/stats" current={location} icon="bar_chart">
          Statistics
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/profile">
          <a className="flex items-center px-4 py-2 text-dark-light font-medium rounded-lg hover:bg-gray-100">
            <div className="w-8 h-8 bg-primary rounded-full mr-3 flex items-center justify-center text-white font-medium">
              {user.name.split(' ').map(name => name[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </a>
        </Link>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  current: string;
  icon: string;
  children: React.ReactNode;
}

function NavLink({ href, current, icon, children }: NavLinkProps) {
  const isActive = current === href;
  
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-3 text-dark-light font-medium rounded-lg",
          isActive
            ? "bg-primary bg-opacity-10 text-primary"
            : "hover:bg-gray-100"
        )}
      >
        <span className="material-icons mr-3">{icon}</span>
        {children}
      </a>
    </Link>
  );
}
