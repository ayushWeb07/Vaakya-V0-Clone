"use client";
import React, { useState } from "react";
import ProjectCard from "./project-card";
import { Message, Project } from "@/generated/prisma/client";
import Link from "next/link";

// design the ts interface
type ProjectType = Project & { messages: Message[] };

interface Props {
  projects: ProjectType[];
}

const ProjectsWrapper = ({ projects }: Props) => {

  
  return (
    <div className="grid grid-cols-3 gap-8">
      {projects?.map((project) => (
          <ProjectCard key={project?.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsWrapper;
