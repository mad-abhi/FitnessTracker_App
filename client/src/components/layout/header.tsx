import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "FitTrack" }: HeaderProps) {
  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-primary">{title}</h1>
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <span className="material-icons">menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function DashboardHeader({ title, date }: { title: string; date: string }) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500 mt-1">{date}</p>
      </div>
    </div>
  );
}
