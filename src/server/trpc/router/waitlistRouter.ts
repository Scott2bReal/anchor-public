import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { authedProcedure, t } from '../trpc'

export const waitlistRouter = t.router({
  getAll: authedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.waitlistEntry.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      })
    } catch (error) {
      console.log(error)
    }
  }),

  getById: authedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.findUnique({
          where: {
            id: input.id,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getEntriesForGym: authedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.findMany({
          where: {
            gymId: input.gymId,
          },
          include: {
            climber: {
              include: {
                offers: true,
              }
            },
            gym: true,
          },
          orderBy: [
            {
              priority: 'desc',
            },
            {
              createdAt: 'asc',
            }
          ]
        })
      } catch (error) {
        console.log(error)
      }
    }),

  getEntriesForGymAndClassType: authedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
        classType: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.findMany({
          where: {
            gymId: input.gymId,
            classType: input.classType,
          },
          include: {
            climber: true,
          }
        })
      } catch (error) {
        console.log(error)
      }
    }),

  putClimberOnWaitlist: authedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        gymId: z.string().cuid(),
        classType: z.string().min(1),
        priority: z.boolean(),
        notes: z.string(),
        mon: z.boolean(),
        tues: z.boolean(),
        weds: z.boolean(),
        thurs: z.boolean(),
        fri: z.boolean(),
        sat: z.boolean(),
        sun: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const avails = [
        //   input.mon,
        //   input.tues,
        //   input.weds,
        //   input.thurs,
        //   input.fri,
        //   input.sat,
        //   input.sun,
        // ]

        return await ctx.prisma.waitlistEntry.create({
          data: {
            classType: input.classType,
            priority: input.priority,
            notes: input.notes,
            mon: input.mon,
            tues: input.tues,
            weds: input.weds,
            thurs: input.thurs,
            fri: input.fri,
            sat: input.sat,
            sun: input.sun,
            gym: {
              connect: { id: input.gymId },
            },
            climber: {
              connect: { id: input.climberId },
            },
          }
        })
      } catch (error) {
        console.log(error)
        throw error
      }
    }),

  remove: authedProcedure
    .input(
      z.object({
        waitlistId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.delete({
          where: { id: input.waitlistId },
        })
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "Couldn't find that waitlist entry"
        })
      }
    }),

  updateGym: authedProcedure
    .input(
      z.object({
        waitlistId: z.string().cuid(),
        gymId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.update({
          where: { id: input.waitlistId },
          data: { gymId: input.gymId },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updatePriority: authedProcedure
    .input(
      z.object({
        entryId: z.string().cuid(),
        priority: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.update({
          where: { id: input.entryId },
          data: { priority: input.priority },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateNotes: authedProcedure
    .input(
      z.object({
        entryId: z.string().cuid(),
        notes: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.update({
          where: { id: input.entryId },
          data: { notes: input.notes },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateClassType: authedProcedure
    .input(
      z.object({
        waitlistId: z.string().cuid(),
        classType: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.update({
          where: { id: input.waitlistId },
          data: { classType: input.classType },
        })
      } catch (error) {
        throw error
      }
    }),

  getEntriesForClimberAndClassType: authedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        gymId: z.string().cuid(),
        classType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.findUnique({
          where: {
            gymId_climberId_classType:
            {
              gymId: input.gymId,
              climberId: input.climberId,
              classType: input.classType,
            }

          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  updateAvailability: authedProcedure
    .input(
      z.object({
        entryId: z.string().cuid(),
        mon: z.boolean(),
        tues: z.boolean(),
        weds: z.boolean(),
        thurs: z.boolean(),
        fri: z.boolean(),
        sat: z.boolean(),
        sun: z.boolean(),

      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.update({
          where: {
            id: input.entryId,
          },
          data: {
            mon: input.mon,
            tues: input.tues,
            weds: input.weds,
            thurs: input.thurs,
            fri: input.fri,
            sat: input.sat,
            sun: input.sun,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  updateAdded: authedProcedure
    .input(
      z.object({
        entryId: z.string().cuid(),
        newAdded: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.update({
          where: {
            id: input.entryId,
          },
          data: {
            createdAt: input.newAdded,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getAllUniqueClimberEntries: authedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.waitlistEntry.findMany({
          distinct: ['climberId'],
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  getForCSV: authedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.waitlistEntry.findMany({
          where: { gymId: input.gymId },
          include: {
            climber: true,
          }
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

})
