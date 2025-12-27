"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import styles from "@/app/projects/_components/styles.module.css";
import { Button } from "@/components/ui/button";
import { Message, Project } from "@/generated/prisma/client";
import Link from "next/link";

import { useTRPC } from "@/modules/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// design the ts props interface
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChangeProjectNameDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: (Project & { messages: Message[] }) | null;
}

const SettingsDialogForAllProjectsPage = ({
  open,
  setOpen,
  setChangeProjectNameDialogOpen,
  project,
}: Props) => {
  // trpc stuff
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // const router = useRouter();
  // load the user
  const { isLoaded, user } = useUser();

  // handle project deletion
  const deleteProjectMutation = useMutation(
    trpc.projects.delete.mutationOptions({
      onSuccess: () => {
        // 1: show toast
        toast.success("Successfully deleted the project");

        // 2: invalidate queries
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
      },

      onError: () => {
        toast.error("Something went wrong while deleting the project!");
      },
    })
  );

  const handleProjectDelete = async () => {
    await deleteProjectMutation.mutateAsync({ id: project?.id as string });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent
          className={`max-w-3/4! bg-popover p-9 border-2 border-border block! overflow-y-auto ${styles.custom_scrollbar}`}
        >
          {/* dialog header */}
          <DialogHeader>
            <DialogTitle className="text-neutral-300 text-lg font-medium">
              Project settings
            </DialogTitle>
            <DialogDescription className="text-neutral-500 text-md font-medium">
              Manage your project details, visibility, and preferences.
            </DialogDescription>
          </DialogHeader>

          {/* dialog overview */}
          <div className="border-t-2 border-border mt-7 pt-7">
            <h3 className="text-neutral-300 text-lg font-medium mb-5">
              Overview
            </h3>

            <div className="flex flex-col gap-7 justify-start items-start">
              <div className="w-full flex justify-between items-start">
                {/* project name */}
                <div>
                  <span className="text-neutral-500 text-sm font-medium">
                    Project name
                  </span>
                  <p className="text-neutral-300 text-base font-medium">
                    {project?.name}
                  </p>
                </div>

                {/* owner  */}
                <div>
                  <span className="text-neutral-500 text-sm font-medium">
                    Owned by
                  </span>
                  <p className="text-neutral-300 text-base font-medium">
                    {isLoaded
                      ? user?.primaryEmailAddress?.emailAddress
                      : "Loading..."}
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-between items-start">
                {/* created at */}
                <div>
                  <span className="text-neutral-500 text-sm font-medium">
                    Created at
                  </span>
                  <p className="text-neutral-300 text-base font-medium">
                    {project?.createdAt?.toLocaleString("en-IN", {
                      weekday: "short", // "Mon"
                      year: "numeric",
                      month: "short", // "Jan"
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>

                {/* updated at -> last message date */}
                <div>
                  <span className="text-neutral-500 text-sm font-medium">
                    Last message on
                  </span>
                  <p className="text-neutral-300 text-base font-medium">
                    {project?.messages[
                      project?.messages?.length - 1
                    ]?.createdAt?.toLocaleString("en-IN", {
                      weekday: "short", // "Mon"
                      year: "numeric",
                      month: "short", // "Jan"
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-between items-start">
                {/* messages count */}
                <div>
                  <span className="text-neutral-500 text-sm font-medium">
                    Messages count
                  </span>
                  <p className="text-neutral-300 text-base font-medium">
                    {project?.messages?.length}
                  </p>
                </div>

                {/* credit used */}
                <div>
                  <span className="text-neutral-500 text-sm font-medium">
                    Credits used
                  </span>
                  <p className="text-neutral-300 text-base font-medium">150</p>
                </div>
              </div>
            </div>
          </div>

          {/* dialog other options */}
          <div className="border-t-2 border-border mt-7 pt-7 flex flex-col gap-7 justify-start items-start">
            {/* rename project */}
            <div className="w-full flex justify-between items-center">
              <div>
                <span className="text-neutral-300 text-lg font-medium">
                  Rename project
                </span>
                <p className="text-neutral-500 text-sm font-medium">
                  Update your project's title.
                </p>
              </div>

              <div>
                <Button
                  onClick={() => setChangeProjectNameDialogOpen(true)}
                  className="cursor-pointer"
                >
                  Rename
                </Button>
              </div>
            </div>

            {/* delete project */}
            <div className="w-full flex justify-between items-center">
              <div>
                <span className="text-neutral-300 text-lg font-medium">
                  Delete project
                </span>
                <p className="text-neutral-500 text-sm font-medium">
                  Permanently delete this project.
                </p>
              </div>

              <div>
                <Button
                  className="cursor-pointer hover:bg-red-700!"
                  variant={"destructive"}
                  onClick={handleProjectDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default SettingsDialogForAllProjectsPage;
