"use client";
import { useTRPC } from "@/modules/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  House,
  MoveUpRight,
  Settings,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import ChangeProjectName from "./change-project-name";
import SettingsDialog from "./settings-dialog";
import { Fragment } from "@/generated/prisma/client";
import { TRPCClientError } from "@trpc/client";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
}

const ProjectHeader = ({ projectId, activeFragment }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [changeProjectNameDialogOpen, setChangeProjectNameDialogOpen] =
    useState<boolean>(false);

  // fetch the project
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );


  // handle key bindings
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // dashboard: Ctrl + D
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        router.push("/projects");
      }

      // settings: Ctrl + K
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }

      // preview: Ctrl + P
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        console.log("Preview dikha");
      }

      // Example: Ctrl + B
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        router.push("/pricing");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // open sandbox url in new tab
  const openSandboxUrlInNewTab = () => {
    window.open(activeFragment?.sandboxUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* the dropdown menu at the top for showing menu links */}
      <DropdownMenu>
        <div className="w-full h-[7vh] bg-popover py-3 px-9 border-b-2 border-border shrink-0 flex flex-col justify-center items-start">
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
            {/* dashboard */}
            <DropdownMenuItem
              onClick={() => router.push("/projects")}
              className="cursor-pointer"
            >
              <p className="inline-flex justify-start items-center gap-2">
                <House />
                Dashboard
              </p>
              <DropdownMenuShortcut>⌘ D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* settings  */}
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="cursor-pointer"
            >
              <p className="inline-flex justify-start items-center gap-2">
                <Settings />
                Settings
              </p>
              <DropdownMenuShortcut>⌘ K</DropdownMenuShortcut>
            </DropdownMenuItem>

            {/* preview */}
            <DropdownMenuItem
              onClick={openSandboxUrlInNewTab}
              className="cursor-pointer"
            >
              <p className="inline-flex justify-start items-center gap-2">
                <MoveUpRight />
                Preview
              </p>
              <DropdownMenuShortcut>⌘ P</DropdownMenuShortcut>
            </DropdownMenuItem>

            {/* credits */}
            <DropdownMenuItem
              onClick={() => router.push("/pricing")}
              className="cursor-pointer"
            >
              <p className="inline-flex justify-start items-center gap-2">
                <Sparkles />
                Get more credits
              </p>
              <DropdownMenuShortcut>⌘ B</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* settings dialog */}
      <SettingsDialog
        open={open}
        setOpen={setOpen}
        setChangeProjectNameDialogOpen={setChangeProjectNameDialogOpen}
        project={project}
      />

      {/* change project name dialog */}
      <ChangeProjectName
        changeProjectNameDialogOpen={changeProjectNameDialogOpen}
        setChangeProjectNameDialogOpen={setChangeProjectNameDialogOpen}
        project={project}
        setOpen={setOpen}
      />
    </>
  );
};

export default ProjectHeader;
