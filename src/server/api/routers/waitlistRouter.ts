import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, createTRPCRouter } from '../trpc'

export const waitlistRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
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

  getById: protectedProcedure
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

  getEntriesForGym: protectedProcedure
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

  getEntriesForGymAndClassType: protectedProcedure
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

  putClimberOnWaitlist: protectedProcedure
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

  remove: protectedProcedure
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

  updateGym: protectedProcedure
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

  updatePriority: protectedProcedure
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

  updateNotes: protectedProcedure
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

  updateClassType: protectedProcedure
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

  getEntriesForClimberAndClassType: protectedProcedure
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

  updateAvailability: protectedProcedure
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

  updateAdded: protectedProcedure
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

  getAllUniqueClimberEntries: protectedProcedure
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

  getForCSV: protectedProcedure
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
