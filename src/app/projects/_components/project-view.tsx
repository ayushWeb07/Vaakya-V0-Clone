"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTRPC } from "@/modules/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";
import { maxSize } from "zod";
import MessagesContainer from "./messages-container";
import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "@/generated/prisma/client";
import ProjectHeader from "./project-header";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  // const trpc = useTRPC();

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  // 1: fetch the single project
  // const { data: project } = useSuspenseQuery(
  //   trpc.projects.getOne.queryOptions({ id: projectId })
  // );

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* messages here */}
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={50}
          className="flex flex-col justify-start items-start"
        >
          {/* project header */}
          <Suspense
            fallback={
              <div className="p-5 flex items-center justify-center">
                <Skeleton className="h-8 w-50 rounded-lg" />
              </div>
            }
          >
            <ProjectHeader projectId={projectId} />
          </Suspense>

          {/* messages list */}
          <Suspense
            fallback={
              <div className="flex items-center pt-15 px-5 pl-25">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
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
