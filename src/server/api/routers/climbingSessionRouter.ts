import { TRPCError } from '@trpc/server'
import { z } from 'zod'
// import { backupReminder } from '../../../utils/slack/messages'
// import slackAPI from '../../../utils/slack/slackAPI'
import { protectedProcedure, createTRPCRouter } from '../trpc'

export const climbingSessionRouter = createTRPCRouter({
  getById: protectedProcedure
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

  getAll: protectedProcedure
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

  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      try {
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

  getUpcoming: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.climbingSession.findFirst({
          where: {
            upcoming: true,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  create: protectedProcedure
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

  setCurrent: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await ctx.prisma.climbingSession.findUnique({
          where: {
            id: input.id,
          }
        })
        const currentSession = await ctx.prisma.climbingSession.findFirst({
          where: {
            current: true,
          }
        })
        if (!session || !currentSession) throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Error finding climbing session data`,
        })
        if (session.upcoming) {
          throw new TRPCError({
            code: `BAD_REQUEST`,
            message: `Please set the next upcoming session before setting this session as the current session`,
          })
        }
        // const reminder = backupReminder(currentSession)
        await ctx.prisma.climbingSession.updateMany({
          data: {
            current: false,
          }
        })
        // Remind everyone to backup the previous session as CSV
        // await slackAPI('chat.postMessage', reminder)
        // return await ctx.prisma.climbingSession.update({
        //   where: {
        //     id: input.id,
        //   },
        //   data: {
        //     current: true,
        //   }
        // })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  setUpcoming: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await ctx.prisma.climbingSession.findUnique({
          where: {
            id: input.id,
          }
        })
        if (!session) throw new TRPCError({
          code: `BAD_REQUEST`,
          message: `That session doesn't exist`,
        })
        if (session.current) {
          // TODO
        }
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

  getAllClasses: protectedProcedure
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

  copyClasses: protectedProcedure
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
              timeZone: climbingClass.timeZone,
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

  delete: protectedProcedure
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

  updateNotes: protectedProcedure
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

  updateStartDate: protectedProcedure
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

  updateEndDate: protectedProcedure
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
