"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import { maxSize } from "zod";
import MessagesContainer from "./messages-container";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();

  // 1: fetch the single project
  // const { data: project } = useSuspenseQuery(
  //   trpc.projects.getOne.queryOptions({ id: projectId })
  // );

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* messages here */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <Suspense
            fallback={
              <div className="flex items-center pt-15 px-5 pl-25">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            }
          >
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={70} maxSize={80} minSize={50}>
          <p>Project yeha display</p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
