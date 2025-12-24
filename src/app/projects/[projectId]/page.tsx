import { getQueryClient, trpc } from "@/modules/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React, { Suspense } from "react";
import ProjectView from "../_components/project-view";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const SingleProjectPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const queryClient = getQueryClient();

  // 1: fetch the single project
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  // 2: fetch the messages of that project
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId })
  );

  return(
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading the project...</p>}>
            <ProjectView projectId={projectId} />
        </Suspense>
    </HydrationBoundary>
  )
};

export default SingleProjectPage;
