import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "../inngest/client";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

// trpc router for handling projects
const projectsRouter = createTRPCRouter({
  // get all projects
  getMany: protectedProcedure.query(async ({ ctx }) => {
    // 1: find all projects in the DB
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      include: {
        messages: true,
      },
    });

    return projects;
  }),

  // get single project
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      // 1: find project in the DB
      const project = await prisma.project.findUnique({
        where: {
          id: input?.id,
          userId: ctx.auth.userId,
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
  create: protectedProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(1, { message: "Message is too short" })
          .max(10000, { message: "Message is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1: create project in the db
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(4, { format: "kebab" }),
          userId: ctx.auth.userId,

          messages: {
            create: [
              {
                content: input?.text,
                userId: ctx.auth.userId,
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
          userId: ctx.auth.userId,
        },
      });

      return createdProject;
    }),

  // delete project
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Project ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1: delete project in the DB
      const project = await prisma.project.delete({
        where: {
          id: input?.id,
          userId: ctx.auth.userId,
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
  changeProjectName: protectedProcedure
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
    .mutation(async ({ input, ctx }) => {
      // 1: update project in the DB
      const project = await prisma.project.update({
        where: {
          id: input?.id,
          userId: ctx.auth.userId,
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
