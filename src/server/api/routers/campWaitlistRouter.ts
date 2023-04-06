import { protectedProcedure, createTRPCRouter } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const campWaitlistRouter = createTRPCRouter({
  getByYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.campWaitlistEntry.findMany({
          where: {
            year: input.year,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  getByGymAndYear: protectedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
        year: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.campWaitlistEntry.findMany({
          where: {
            gymId: input.gymId,
            year: input.year,
          },
          include: {
            climber: {
              include: {
                campOffers: true,
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
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  getByClimber: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWaitlistEntry.findMany({
          where: {
            climberId: input.climberId,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  add: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        gymId: z.string().cuid(),
        year: z.number(),
        availability: z.array(z.string()),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const ids = await ctx.prisma.campWaitlistEntry.findMany({
          where: {
            climberId: input.climberId,
            gymId: input.gymId,
            year: input.year,
          }
        })

        if (ids.length > 0) throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Climber is already on the waitlist'
        })

        return await ctx.prisma.campWaitlistEntry.create({
          data: {
            climber: { connect: { id: input.climberId, } },
            gym: { connect: { id: input.gymId, } },
            year: input.year,
            availability: input.availability,
            notes: input.notes,
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
        id: z.string().cuid()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWaitlistEntry.delete({
          where: {
            id: input.id,
          }
        })
      } catch (e) {
        console.error(e)
        throw e
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
        return await ctx.prisma.campWaitlistEntry.update({
          where: { id: input.entryId },
          data: { notes: input.notes },
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
        return await ctx.prisma.campWaitlistEntry.update({
          where: { id: input.entryId },
          data: { priority: input.priority },
        })
      } catch (error) {
        console.log(error)
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
        return await ctx.prisma.campWaitlistEntry.update({
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

  updateAvailability: protectedProcedure
    .input(
      z.object({
        entryId: z.string().cuid(),
        availability: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campWaitlistEntry.update({
          where: {
            id: input.entryId,
          },
          data: {
            availability: input.availability,
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

})
