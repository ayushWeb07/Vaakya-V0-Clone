import { getQueryClient, trpc } from "@/modules/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import ProjectView from "../_components/single-project/project-view";
import { ErrorBoundary } from 'react-error-boundary';
import { ProjectNotFound } from "../_components/single-project/project-not-found";

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

  // 3: fetch the usage tracker status
  void queryClient.prefetchQuery(
    trpc.usage.getStatus.queryOptions()
  );

  // 4: fetch the user has pro plus plan
  void queryClient.prefetchQuery(
    trpc.usage.hasProPlusPlan.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<ProjectNotFound />} >
        <Suspense fallback={<p>Loading the project...</p>}>
        <ProjectView projectId={projectId} />
      </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default SingleProjectPage;
