import { authedProcedure, t } from '../trpc'
import { z } from 'zod'


export const campWeekRouter = t.router({
  getById: authedProcedure
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

  addWeek: authedProcedure
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
    })
})
