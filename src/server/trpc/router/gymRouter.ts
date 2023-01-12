import { authedProcedure, t } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const gymRouter = t.router({
  getAll: authedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.gym.findMany({
        include: {
          waitlistEntries: true,
          classes: {
            include: {
              climbers: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })
    } catch (error) {
      console.log(error)
    }
  }),

  getForGymNav: authedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.gym.findMany({
          select: {
            id: true,
            name: true,
            cssCode: true,
          },
          orderBy: {
            name: 'asc',
          }
        })
      } catch (error) {
        console.log(error)
      }
    }),

  getForSideNav: authedProcedure
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
          }
        })
      } catch (e) {
        console.log(e)
        throw (e)
      }
    }),

  getForClassInfo: authedProcedure
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
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getByName: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name } = input
      const gym = await ctx.prisma.gym.findUnique({
        where: { name },
        include: {
          classes: true,
        },
      })
      if (!gym) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No gym with name ${name}`,
        })
      } else {
        return gym
      }
    }),

  getById: authedProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
        sessionId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input
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
                startTime: 'asc',
              },
              {
                className: 'asc',
              },
            ],
            include: {
              climbers: true,
              offers: true,
            },
          },
        },
      })
      if (!gym) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No gym with id ${id}`,
        })
      } else {
        return gym
      }
    }),

  getSchedule: authedProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const gymId = input.id
      try {
        return await ctx.prisma.gym.findMany({
          where: { id: gymId },
          include: {
            classes: true,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  getBasicInfo: authedProcedure
    .input(
      z.object({
        gymId: z.string().cuid().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.gym.findUnique({
          where: { id: input.gymId },
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getCampWeeksById: authedProcedure
    .input(
      z.object({
        gymId: z.string().cuid()
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
              },
              orderBy: {
                weekNumber: 'asc',
              }
            },
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    })
})
