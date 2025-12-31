import { getQueryClient, trpc } from "@/modules/trpc/server";
import ProjectsUi from "./_components/all-projects/projects-ui";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Navbar from "../(home)/_components/navbar";
import { ErrorBoundary } from "react-error-boundary";
import { Footer } from "../(home)/_components/footer";

const ProjectsPage = async () => {
  // prefetch the projects
  const queryClient = getQueryClient();

  // 1: fetch the projects
  void queryClient.prefetchQuery(trpc.projects.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Navbar />

      <ErrorBoundary
        fallback={
          <div className="py-35 px-20 bg-background min-h-screen">
            <p className="text-red-500 text-xl font-medium mb-5">
              Error while loading the projects...
            </p>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="py-35 px-20 bg-background min-h-screen">
              <p className="text-neutral-300 text-xl font-medium mb-5">
                Loading the projects...
              </p>
            </div>
          }
        >
          <ProjectsUi />
        </Suspense>
      </ErrorBoundary>

      <Footer />
    </HydrationBoundary>
  );
};

export default ProjectsPage;
