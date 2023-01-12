import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure, t } from '../trpc'

export const userRouter = t.router({
  getCurrent: authedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      })
      // There needs to be a user, otherwise someone is seeing things they shouldn't
      if (!user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user found',
        })
      return user
    } catch (e) {
      console.error(e)
    }
  }),

  setDefaultSession: authedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        sessionId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            defaultSessionId: input.sessionId,
          }
        })
      } catch (e) {
        console.error(e)
      }
    }),

  setShowCampPref: authedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        showCamp: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            showCamp: input.showCamp,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    })
})
