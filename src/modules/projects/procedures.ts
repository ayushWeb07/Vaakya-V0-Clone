import z from "zod";
import { baseProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

// trpc router for handling projects
const projectsRouter = createTRPCRouter({
  // get all projects
  getMany: baseProcedure.query(async () => {
    // 1: find all projects in the DB
    const projects = await prisma.project.findMany({
      include: {
        messages: true,
      },
    });

    return projects;
  }),

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
          id: input?.id,
        },

        include: {
          messages: true,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project doesn't exist",
        });

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

  // delete project
  delete: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      // 1: delete project in the DB
      const project = await prisma.project.delete({
        where: {
          id: input?.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project doesn't exist",
        });
      }

      return project;
    }),

  // change project name
  changeProjectName: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
        name: z
          .string()
          .min(5, { message: "Project name must have atleast 5 characters" })
          .max(100, {
            message: "Project name must have atmost 100 characters",
          }),
      })
    )
    .mutation(async ({ input }) => {
      // 1: update project in the DB
      const project = await prisma.project.update({
        where: {
          id: input?.id,
        },
        data: {
          name: input?.name,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project doesn't exist",
        });
      }

      return project;
    }),
});

export { projectsRouter };
