import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/modules/inngest/client";
import { messageRouter } from "@/modules/messages/procedures";
import { projectsRouter } from "@/modules/projects/procedures";
export const appRouter = createTRPCRouter({
    messages: messageRouter,
    projects: projectsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
