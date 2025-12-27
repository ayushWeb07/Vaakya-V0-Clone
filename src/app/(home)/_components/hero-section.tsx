"use client";
import React from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { AddProjectForm } from "./add-project-form";

const placeholders = [
  "What's the first rule of Fight Club?",
  "Who is Tyler Durden?",
  "Where is Andrew Laeddis Hiding?",
  "Write a Javascript method to reverse a string",
  "How to assemble your own PC?",
];

const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  console.log(e.target.value);
};
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log("submitted");
};

const HeroSection = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start pt-52 overflow-hidden">

      <BackgroundRippleEffect />

      <div className="w-3xl flex flex-col justify-center items-center gap-7">
        <h2 className="relative z-10 text-center text-5xl font-bold text-neutral-200">
          What do you want to Build?
        </h2>

        <AddProjectForm />
      </div>
    </div>
  );
};

export { HeroSection };
