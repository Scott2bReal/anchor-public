import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure, t } from '../trpc'

export const climbingSessionRouter = t.router({
  getById: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingSession.findUnique({
          where: {
            id: input.id,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getAll: authedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.climbingSession.findMany({
          orderBy: {
            createdAt: 'asc',
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getCurrent: authedProcedure
    .query(async ({ ctx }) => {
      try {
        // TODO add more protections at DB level to make sure there is only one current session
        return await ctx.prisma.climbingSession.findFirst({
          where: {
            current: true,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getCurrentId: authedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.climbingSession.findFirst({
          where: {
            current: true,
          },
          select: {
            id: true,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  create: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        startDate: z.date(),
        endDate: z.date(),
        year: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingSession.create({
          data: {
            name: input.name,
            startDate: input.startDate,
            endDate: input.endDate,
            year: input.year,
            current: false,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  setCurrent: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.climbingSession.updateMany({
          data: {
            current: false,
          }
        })

        return await ctx.prisma.climbingSession.update({
          where: {
            id: input.id,
          },
          data: {
            current: true,
          }

        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  setUpcoming: authedProcedure
  .input(
    z.object({
      id: z.string().cuid(),
    })
  )
  .mutation(async ({ctx, input})=>{
    try {
      await ctx.prisma.climbingSession.updateMany({
        data: {
          upcoming: false,
        }
      })
      return await ctx.prisma.climbingSession.update({
        where: {
          id: input.id,
        },
        data: {
          upcoming: true,
        }
      })
    } catch (e) {
      console.log(e)
    }
  }),

  getAllClasses: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingClass.findMany({
          where: {
            sessionId: input.id,
          },
          include: {
            climbers: true,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  copyClasses: authedProcedure
    .input(
      z.object({
        currentSessionId: z.string().cuid(),
        newSessionId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newClasses = await ctx.prisma.climbingClass.findMany({
          where: {
            sessionId: input.newSessionId,
          }
        })

        if (newClasses.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'New session must have no classes on the schedule to copy the current schedule'
          })
        }
        const currentClasses = await ctx.prisma.climbingClass.findMany({
          where: {
            sessionId: input.currentSessionId,
          },
          include: {
            climbers: true,
          }
        })

        /*
  Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 10, connection limit: 5)
        */

        const result = Promise.all(currentClasses.map(async (climbingClass) => {
          const newClass = await ctx.prisma.climbingClass.create({
            data: {
              className: climbingClass.className,
              gymId: climbingClass.gymId,
              day: climbingClass.day,
              instructor: climbingClass.instructor,
              cssCode: climbingClass.cssCode,
              slots: climbingClass.slots,
              startTime: climbingClass.startTime,
              endTime: climbingClass.endTime,
              sessionId: input.newSessionId,
            },
          })

          const newRoster = await Promise.all(climbingClass.climbers.map(async (climber) => {
            return ctx.prisma.climbingClass.update({
              where: {
                id: newClass.id,
              },
              data: {
                climbers: {
                  connect: { id: climber.id }
                }
              },
            })
          }))

          return newRoster
        })
        )

        return result
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  delete: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const sessions = await ctx.prisma.climbingSession.findMany()

        if (sessions.length === 1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot delete the last remaining session',
          })
        }

        return await ctx.prisma.climbingSession.delete({
          where: {
            id: input.id,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  updateNotes: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingSession.update({
          where: {
            id: input.id,
          },
          data: {
            notes: input.notes,
          }
        })
      } catch (e) {
        console.log(e)
      }
    }),

  updateStartDate: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        date: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingSession.update({
          where: {
            id: input.id,
          },
          data: {
            startDate: input.date,
          }
        })
      } catch (e) {
        console.log(e)
      }
    }),

  updateEndDate: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        date: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climbingSession.update({
          where: {
            id: input.id,
          },
          data: {
            endDate: input.date,
          }
        })
      } catch (e) {
        console.log(e)
      }
    }),
})
