"use client";
import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, House, MoveUpRight, Settings, Sparkles } from "lucide-react";

interface Props {
  projectId: string;
}

const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();

  // fetch the project
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions(
      { id: projectId },
      { refetchInterval: 3000 }
    )
  );

  return (
    <DropdownMenu>
      <div className="w-full bg-popover py-3 px-9 border-b-2 border-border shrink-0">
        <DropdownMenuTrigger asChild>
          <span className="text-neutral-300 text-md font-medium inline-flex gap-2 cursor-pointer justify-start items-center">
            {project?.name} <ChevronDown size={25} />
          </span>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent
        className="min-w-72 bg-card border-2 border-border rounded-lg p-3 text-neutral-300 text-sm font-medium outline-0 flex flex-col gap-3"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <p className="inline-flex justify-start items-center gap-2">
              <House />
              Dashboard
            </p>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" >
             <p className="inline-flex justify-start items-center gap-2">
              <Settings />
              Settings
            </p>
            <DropdownMenuShortcut>⌘.</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" >
            
            <p className="inline-flex justify-start items-center gap-2">
              <MoveUpRight />
              Preview
            </p>
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer" >
            
            <p className="inline-flex justify-start items-center gap-2">
              <Sparkles />
              Get more credits
            </p>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectHeader;
