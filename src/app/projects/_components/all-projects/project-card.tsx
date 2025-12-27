"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Message, Project } from "@/generated/prisma/client";
import { Ellipsis, MoveUpRight, Settings, Trash } from "lucide-react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import SettingsDialog from "../single-project/settings-dialog";
import ChangeProjectName from "../single-project/change-project-name";
import SettingsDialogForAllProjectsPage from "./settings-dialog";
import ChangeProjectNameForAllProjectsPage from "./change-project-name";
import Image from "next/image";
import { User } from "@clerk/nextjs/server";

// design the ts interface
interface Props {
  project: Project & { messages: Message[] };
}

const ProjectCard = ({ project }: Props) => {
  // for handling the settings and the change project name dialog
  const [open, setOpen] = useState<boolean>(false);
  const [changeProjectNameDialogOpen, setChangeProjectNameDialogOpen] =
    useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col gap-3 group cursor-pointer">
        {/* thumbnail image */}
        <Link href={`/projects/${project?.id}`}>
          <div className="overflow-hidden rounded-lg">
            <Image
              src={project?.thumbnailUrl as string}
              alt="project_thumbnail"
              className="w-full group-hover:scale-115 object-center object-cover transition-all duration-200"
              width={640}
              height={320}
            />
          </div>
        </Link>

        {/* project info */}
        <div className="flex justify-between items-center">
          <div className="">
            <span className="text-neutral-300 text-base font-medium">
              {project?.name}
            </span>
            <p className="text-neutral-400 text-sm font-medium">
              Edited{" "}
              {formatDistanceToNow(project?.updatedAt, { addSuffix: true })}
            </p>
          </div>

          {/* more project options */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              className="cursor-pointer text-neutral-400 hover:text-primary transition-all duration-300"
              variant={"ghost"}
              onClick={() => setOpen(true)}
            >
              <Settings size={20} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0">
        {/* settings dialog */}
        <SettingsDialogForAllProjectsPage
          open={open}
          setOpen={setOpen}
          setChangeProjectNameDialogOpen={setChangeProjectNameDialogOpen}
          project={project}
        />

        {/* change project name dialog */}
        <ChangeProjectNameForAllProjectsPage
          changeProjectNameDialogOpen={changeProjectNameDialogOpen}
          setChangeProjectNameDialogOpen={setChangeProjectNameDialogOpen}
          project={project}
          setOpen={setOpen}
        />
      </div>
    </>
  );
};

export default ProjectCard;
