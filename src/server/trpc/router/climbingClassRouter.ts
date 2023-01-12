import { authedProcedure, t } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { cssClassTypeCodes } from '../../../utils/cssClassTypeCodes'

const cssCodes = cssClassTypeCodes

export const climbingClassRouter = t.router({
  getClassInfo: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  hasAvailability: authedProcedure
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
        })

        if (!info) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Couldn\'t find that class',
          })
        } else if (info.slots - info.climbers.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'That class is full',
          })
        }

        return true
      } catch (e) {
        console.log(e)
      }
    }),

  create: authedProcedure
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
            code: 'BAD_REQUEST',
            message: 'Error parsing class name CSS code. Please email scott@faclimbing.com'
          })
        }

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
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  deleteClimbingClass: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateClassType: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateInstructor: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateTime: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateSlots: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateGym: authedProcedure
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
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateDay: authedProcedure
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
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })
})
