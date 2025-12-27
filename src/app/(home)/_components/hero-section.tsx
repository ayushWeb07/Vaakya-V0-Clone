"use client";
import React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { AddProjectForm } from "./add-project-form";

// ts props interface
interface Props {
  isAuthenticated: boolean
}

const HeroSection = ({isAuthenticated}: Props) => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start pt-52 overflow-hidden">

      <BackgroundRippleEffect />

      <div className="w-3xl flex flex-col justify-center items-center gap-7">
        <h2 className="relative z-10 text-center text-5xl font-bold text-neutral-200">
          What do you want to Build?
        </h2>

        <AddProjectForm isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};

export { HeroSection };
