import { protectedProcedure, createTRPCRouter } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const campWeekRouter = createTRPCRouter({
  // This camp year thing is silly enough that I'd rather not create a whole
  // new router for it. Just lumping these few routes in with the camp weeks
  // since they're so closely linked
  getYears: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.campWeekYear.findMany()
      } catch (e) {
        console.error(e)
      }
    }),

  getYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeekYear.findUnique({
          where: {
            year: input.year
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  addYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.prisma.campWeekYear.findMany()
        const years = result.map(year => year.year)
        if (years.includes(input.year)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `We already have ${input.year} in the system!`,
          })
        }
        return await ctx.prisma.campWeekYear.create({
          data: {
            year: input.year,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  // These are the real camp week routes...

  getByGymAndYear: protectedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
        year: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.findMany({
          where: {
            gymId: input.gymId,
            year: input.year,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.findUnique({
          where: {
            id: input.weekId,
          },
          include: {
            climbers: true,
          }
        })
      } catch (e) {
        console.error(e)
      }
    }),

  addWeek: protectedProcedure
    .input(
      z.object({
        weekNumber: z.number().lt(9).gt(0),
        year: z.number().gt(2022),
        startDate: z.date(),
        endDate: z.date(),
        gymId: z.string().cuid(),
        instructor: z.string(),
        slots: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.create({
          data: {
            weekNumber: input.weekNumber,
            year: input.year,
            startDate: input.startDate,
            endDate: input.endDate,
            gymId: input.gymId,
            instructor: input.instructor,
            slots: input.slots,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  remove: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.delete({
          where: {
            id: input.weekId,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  createCampYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeekYear.create({
          data: {
            year: input.year
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  editWeek: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
        newWeekNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.update({
          where: {
            id: input.weekId,
          },
          data: {
            weekNumber: input.newWeekNumber,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  editDates: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
        newStartDate: z.date(),
        newEndDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.update({
          where: {
            id: input.weekId,
          },
          data: {
            startDate: input.newStartDate,
            endDate: input.newEndDate,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  editInstructor: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
        instructor: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWeek.update({
          where: {
            id: input.weekId,
          },
          data: {
            instructor: input.instructor,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

})
