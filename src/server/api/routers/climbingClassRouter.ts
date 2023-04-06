import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cssClassTypeCodes } from "../../../utils/cssClassTypeCodes";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getGymTimeZone } from "../../../utils/getGymTimeZone";

const cssCodes = cssClassTypeCodes;

export const climbingClassRouter = createTRPCRouter({
  getClassInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.findUnique({
          where: { id: input.id },
          include: {
            climbers: true,
            offers: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  hasAvailability: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const info = await ctx.prisma.climbingClass.findUnique({
          where: { id: input.id },
          select: { slots: true, climbers: true },
        });

        if (!info) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldn't find that class",
          });
        } else if (info.slots - info.climbers.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That class is full",
          });
        }

        return true;
      } catch (e) {
        console.log(e);
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        className: z.string().min(1),
        gymId: z.string().cuid(),
        day: z.string(),
        instructor: z.string(),
        startTime: z.date(),
        endTime: z.date(),
        slots: z.number(),
        sessionId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.className || !cssCodes[input.className]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Error parsing class name CSS code. Please email scott@faclimbing.com",
          });
        }
        const gymInfo = await ctx.prisma.gym.findUnique({
          where: { id: input.gymId },
        });
        if (!gymInfo) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldn't find that gym",
          });
        }
        const timeZone = getGymTimeZone(gymInfo)
        return await ctx.prisma.climbingClass.create({
          data: {
            className: input.className,
            gymId: input.gymId,
            day: input.day,
            instructor: input.instructor,
            startTime: input.startTime,
            endTime: input.endTime,
            slots: input.slots,
            // Not sure why this didn't figure this out...
            cssCode: cssCodes[input.className] as string,
            sessionId: input.sessionId,
            timeZone: timeZone,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  deleteClimbingClass: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateClassType: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
        className: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.update({
          where: { id: input.classId },
          data: { className: input.className },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateInstructor: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
        instructor: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.update({
          where: { id: input.classId },
          data: { instructor: input.instructor },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateTime: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
        startTime: z.date(),
        endTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.update({
          where: { id: input.classId },
          data: {
            startTime: input.startTime,
            endTime: input.endTime,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateSlots: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
        slots: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.update({
          where: { id: input.classId },
          data: { slots: input.slots },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateGym: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
        gymId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.update({
          where: { id: input.classId },
          data: { gymId: input.gymId },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  updateDay: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
        newDay: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.update({
          where: { id: input.classId },
          data: { day: input.newDay },
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }),

  // copy this class (with roster) to upcoming session
  copyClass: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const upcomingSession = await ctx.prisma.climbingSession.findFirst({
          where: { upcoming: true },
          select: { id: true },
        });
        const currentSession = await ctx.prisma.climbingSession.findFirst({
          where: { current: true },
          select: { id: true },
        });
        if (!upcomingSession || !currentSession) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Error finding upcoming and current sessions",
          });
        }
        const classToCopy = await ctx.prisma.climbingClass.findFirst({
          where: { id: input.classId },
          include: {
            climbers: true,
          },
        });
        if (!classToCopy) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No class found",
          });
        } else if (classToCopy.sessionId === upcomingSession.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Class already in upcoming session",
          });
        } else if (classToCopy.sessionId !== currentSession.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Class not in current session",
          });
        }
        const newClass = await ctx.prisma.climbingClass.create({
          data: {
            className: classToCopy.className,
            gymId: classToCopy.gymId,
            day: classToCopy.day,
            instructor: classToCopy.instructor,
            startTime: classToCopy.startTime,
            endTime: classToCopy.endTime,
            slots: classToCopy.slots,
            cssCode: classToCopy.cssCode,
            sessionId: upcomingSession.id,
            timeZone: classToCopy.timeZone,
          },
        });
        await Promise.all(
          classToCopy.climbers.map(async (climber) => {
            await ctx.prisma.climbingClass.update({
              where: { id: newClass.id },
              data: {
                climbers: {
                  connect: {
                    id: climber.id,
                  },
                },
              },
            });
          })
        );
        return newClass;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
});
