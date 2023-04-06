import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gymRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.gym.findMany({
        include: {
          waitlistEntries: true,
          classes: {
            include: {
              climbers: true,
            },
            orderBy: {
              startTime: "asc",
              instructor: "asc",
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

  getForExport: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.gym.findMany({
          include: {
            classes: {
              where: {
                sessionId: input.sessionId,
              },
              include: {
                climbers: true,
              },
            },
            waitlistEntries: {
              include: {
                climber: true,
              },
              orderBy: [
                {
                  priority: "desc",
                },
                {
                  createdAt: "asc",
                },
              ],
            },
          },
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),

  getForGymNav: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.gym.findMany({
        select: {
          id: true,
          name: true,
          cssCode: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

  getForSideNav: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.gym.findUnique({
          where: {
            id: input.id,
          },
          select: {
            cssCode: true,
          },
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }),

  getForClassInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.gym.findUnique({
          where: {
            id: input.id,
          },
          select: {
            name: true,
            cssCode: true,
          },
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }),

  getByName: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name } = input;
      const gym = await ctx.prisma.gym.findUnique({
        where: { name },
        include: {
          classes: true,
        },
      });
      if (!gym) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No gym with name ${name}`,
        });
      } else {
        return gym;
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
        sessionId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const gym = await ctx.prisma.gym.findUnique({
        where: { id },
        include: {
          waitlistEntries: true,
          classes: {
            where: {
              sessionId: input.sessionId,
            },
            orderBy: [
              {
                startTime: "asc",
              },
              {
                className: "asc",
              },
              {
                instructor: "asc",
              },
            ],
            include: {
              climbers: true,
              offers: true,
            },
          },
        },
      });
      if (!gym) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No gym with id ${id}`,
        });
      } else {
        return gym;
      }
    }),

  getSchedule: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const gymId = input.id;
      try {
        return await ctx.prisma.gym.findMany({
          where: { id: gymId },
          include: {
            classes: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getBasicInfo: protectedProcedure
    .input(
      z.object({
        gymId: z.string().cuid().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.gym.findUnique({
          where: { id: input.gymId },
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }),

  getCampWeeksById: protectedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.gym.findUnique({
          where: { id: input.gymId },
          include: {
            campWeeks: {
              include: {
                climbers: true,
                campOffers: true,
              },
              orderBy: {
                weekNumber: "asc",
              },
            },
          },
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
});
