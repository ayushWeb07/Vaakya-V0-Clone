import z from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

// trpc router for handling projects
const projectsRouter = createTRPCRouter({
  // get single project
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input }) => {

      // 1: find project in the DB
      const project = await prisma.project.findUnique({
        where: {
          id: input?.id
        }
      });

      if(!project) {
        throw new TRPCError({code: "NOT_FOUND", message: "Project doesn't exist"})
      }

      return project;
    }),

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
          name: generateSlug(4, { format: "kebab" }),

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
          projectId: createdProject?.id,
        },
      });

      return createdProject;
    }),
});

export { projectsRouter };
