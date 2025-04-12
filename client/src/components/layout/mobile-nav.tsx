import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutForm } from "@/components/workouts/workout-form";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <nav className={cn("lg:hidden bg-white border-t border-gray-200 flex items-center justify-around px-2 py-3", className)}>
      <NavLink href="/dashboard" current={location} icon="dashboard" label="Dashboard" />
      <NavLink href="/workouts" current={location} icon="fitness_center" label="Workouts" />
      
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white -mt-5">
              <span className="material-icons">add</span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <WorkoutForm />
        </DialogContent>
      </Dialog>
      
      <NavLink href="/exercises" current={location} icon="directions_run" label="Exercises" />
      <NavLink href="/profile" current={location} icon="person" label="Profile" />
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  current: string;
  icon: string;
  label: string;
}

function NavLink({ href, current, icon, label }: NavLinkProps) {
  const isActive = current === href;
  
  return (
    <Link href={href}>
      <a className={cn("flex flex-col items-center", isActive ? "text-primary" : "text-gray-500")}>
        <span className="material-icons">{icon}</span>
        <span className="text-xs mt-1">{label}</span>
      </a>
    </Link>
  );
}
