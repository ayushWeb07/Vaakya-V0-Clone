import { z } from "zod";
import { createTRPCRouter } from "../init";
import { inngest } from "@/modules/inngest/client";
import { messagesRouter } from "@/modules/messages/procedures";
import { projectsRouter } from "@/modules/projects/procedures";
import { fragmentsRouter } from "@/modules/fragments/procedures";
export const appRouter = createTRPCRouter({
    messages: messagesRouter,
    projects: projectsRouter,
    fragments: fragmentsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
