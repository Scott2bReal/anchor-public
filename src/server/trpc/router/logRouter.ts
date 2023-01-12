import { z } from 'zod'
import { authedProcedure, t } from '../trpc'

export const logRouter = t.router({
  climberLog: authedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climberLog.create({
          data: {
            climberId: input.climberId,
            message: input.message,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getClimberLogs: authedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climberLog.findMany({
          where: {
            climberId: input.climberId,
          },
          orderBy: {
            createdAt: 'asc',
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  clearLogs: authedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climberLog.deleteMany({
          where: {
            climberId: input.climberId,
          },
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    })
})
