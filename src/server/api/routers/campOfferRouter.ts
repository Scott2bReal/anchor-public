import { protectedProcedure, createTRPCRouter } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const campOfferRouter = createTRPCRouter({
  getAllByGymAndYear: protectedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
        year: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.campOffer.findMany({
          where: {
            gymId: input.gymId,
            campWeek: {
              year: input.year,
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        campOfferId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.campOffer.findUnique({
          where: {
            id: input.campOfferId,
          },
          include: {
            gym: true,
            climber: true,
            campWeek: {
              include: {
                climbers: true,
                campOffers: true,
              }
            },
            user: true,
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  getByWeek: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.campOffer.findMany({
          where: {
            weekId: input.weekId,
          },
          include: {
            gym: true,
            climber: true,
            campWeek: {
              include: {
                climbers: true,
                campOffers: true,
              }
            },
            user: true,
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  getByClimberAndWeek: protectedProcedure
    .input(
      z.object({
        weekId: z.string().cuid(),
        climberId: z.string().cuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.campOffer.findUnique({
          where: {
            climberId_weekId: {
              weekId: input.weekId,
              climberId: input.climberId,
            },
          },
          include: {
            gym: true,
            climber: true,
            campWeek: {
              include: {
                climbers: true,
                campOffers: true,
              }
            },
            user: true,
          },
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  createOffer: protectedProcedure
    .input(
      z.object({
        campWeekId: z.string().cuid(),
        userId: z.string().cuid(),
        climberId: z.string().cuid(),
        notes: z.string(),
        zendeskTicket: z.string().url(),
        expiration: z.date(),
        gymId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const info = await ctx.prisma.campWeek.findUnique({
          where: { id: input.campWeekId },
          select: { slots: true, climbers: true },
        })
        if (!info) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Couldn't find that camp week",
          })
        }
        const existingOffer = await ctx.prisma.campOffer.findUnique({
          where: {
            climberId_weekId: {
              climberId: input.climberId,
              weekId: input.campWeekId,
            },
          },
          include: {
            climber: true,
          },
        })
        const existingOffers = await ctx.prisma.campOffer.findMany({
          where: {
            weekId: input.campWeekId,
          },
        })
        const offersCount = existingOffers.length
        const enrolledIds = info.climbers.map((climber) => climber.id)
        if (existingOffer) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `${existingOffer.climber.name} has already been offered this class`,
          })
        } else if (offersCount + enrolledIds.length >= info.slots) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "That class can't accept any more offers",
          })
        }
        if (enrolledIds.includes(input.climberId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'That climber is already enrolled in this week of camp!',
          })
        }
        return await ctx.prisma.campOffer.create({
          data: {
            weekId: input.campWeekId,
            userId: input.userId,
            climberId: input.climberId,
            notes: input.notes,
            zendeskTicket: input.zendeskTicket,
            expiration: input.expiration,
            gymId: input.gymId,
          },
        })
      } catch (e) {
        console.log(e)
        throw e
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        campOfferId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campOffer.delete({
          where: {
            id: input.campOfferId
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    }),

  updateExpiration: protectedProcedure
    .input(
      z.object({
        campOfferId: z.string().cuid(),
        expiration: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campOffer.update({
          where: { id: input.campOfferId },
          data: { expiration: input.expiration },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateNotes: protectedProcedure
    .input(
      z.object({
        campOfferId: z.string().cuid(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campOffer.update({
          where: { id: input.campOfferId },
          data: { notes: input.notes },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateZendeskTicket: protectedProcedure
    .input(
      z.object({
        campOfferId: z.string().cuid(),
        zendeskTicket: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.campOffer.update({
          where: { id: input.campOfferId },
          data: { zendeskTicket: input.zendeskTicket },
        })
      } catch (error) {
        console.log(error)
      }
    }),

})
