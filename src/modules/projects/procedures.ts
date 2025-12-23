import z from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";
import { generateSlug } from "random-word-slugs";


// trpc router for handling projects
const projectsRouter = createTRPCRouter({

  // create project
  create: baseProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(1, { message: "Message is too short" })
          .max(10000, { message: "Message is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      // 1: create project in the db
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(4, {format: "kebab"}),

          messages: {
            create: [
              {
                content: input?.text,
                role: "USER",
                type: "RESULT",
              },
            ],
          },
        },
      });

      // 2: start the inngest event
      await inngest.send({
        name: "ai-agent/invoke",
        data: {
          prompt: input?.text,
          projectId: createdProject?.id
        },
      });

      return createdProject;
    }),
});

export { projectsRouter };
