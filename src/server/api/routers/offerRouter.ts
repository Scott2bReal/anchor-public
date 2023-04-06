import { TRPCError } from '@trpc/server'
import { z } from 'zod'
// import {
//   expiredOffersHeader,
//   slackOfferMessage,
// } from '../../../utils/slack/messages'
// import slackAPI from '../../../utils/slack/slackAPI'
import { createTRPCRouter, protectedProcedure, /* publicProcedure */ } from '../trpc'

export const offerRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.offer.findMany({
        include: {
          climbingClass: true,
          climber: true,
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
    } catch (error) {
      console.log(error)
    }
  }),

  getByGym: protectedProcedure
    .input(
      z.object({
        gymId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.findMany({
          where: {
            gymId: input.gymId,
          },
          include: {
            climbingClass: true,
            climber: true,
            user: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        })
      } catch (e) {
        console.log(e)
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        offerId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.findUnique({
          where: {
            id: input.offerId,
          },
          include: {
            climber: true,
            user: true,
            climbingClass: {
              include: {
                climbers: true,
                offers: true,
              },
            },
          },
        })
      } catch (error) {
        console.log(error)
        throw error
      }
    }),

  getByClass: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.findMany({
          where: {
            classId: input.classId,
          },
          include: {
            climber: true,
            user: true,
            climbingClass: true,
          },
        })
      } catch (e) {
        console.log(e)
      }
    }),

  createOffer: protectedProcedure
    .input(
      z.object({
        classId: z.string().cuid(),
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
        const info = await ctx.prisma.climbingClass.findUnique({
          where: { id: input.classId },
          select: { slots: true, climbers: true },
        })

        if (!info) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Couldn't find that class",
          })
        }

        const existingOffer = await ctx.prisma.offer.findUnique({
          where: {
            climberId_classId: {
              climberId: input.climberId,
              classId: input.classId,
            },
          },
          include: {
            climber: true,
          },
        })

        const existingOffers = await ctx.prisma.offer.findMany({
          where: {
            classId: input.classId,
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
            message: 'That climber is already enrolled in this class!',
          })
        }

        return await ctx.prisma.offer.create({
          data: {
            classId: input.classId,
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

  deleteOffer: protectedProcedure
    .input(
      z.object({
        offerId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.delete({
          where: { id: input.offerId },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateExpiration: protectedProcedure
    .input(
      z.object({
        offerId: z.string().cuid(),
        expiration: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.update({
          where: { id: input.offerId },
          data: { expiration: input.expiration },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateNotes: protectedProcedure
    .input(
      z.object({
        offerId: z.string().cuid(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.update({
          where: { id: input.offerId },
          data: { notes: input.notes },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  updateZendeskTicket: protectedProcedure
    .input(
      z.object({
        offerId: z.string().cuid(),
        zendeskTicket: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.update({
          where: { id: input.offerId },
          data: { zendeskTicket: input.zendeskTicket },
        })
      } catch (error) {
        console.log(error)
      }
    }),

  getByClimberAndClass: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        classId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.offer.findUnique({
          where: {
            climberId_classId: {
              climberId: input.climberId,
              classId: input.classId,
            },
          },
          include: {
            user: true,
          },
        })
      } catch (e) {
        console.log(e)
      }
    }),

  // checkOffers: publicProcedure.mutation(async ({ ctx }) => {
  //   try {
  //     const now = new Date()
  //     const token = process.env.SLACKBOT_TOKEN
  //     const channelId = process.env.REMINDERS_CHANNEL_ID
  //
  //     if (!token) {
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'No slack bot token found',
  //       })
  //     } else if (!channelId) {
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'No slack channel found',
  //       })
  //     }
  //
  //     const offers = await ctx.prisma.offer.findMany({
  //       include: {
  //         user: true,
  //         climber: true,
  //       },
  //     })
  //
  //     const expiredOffers = offers.filter((offer) => offer.expiration < now)
  //
  //     if (expiredOffers.length === 0) return
  //
  //     const messages = expiredOffers.map((offer) => {
  //       return slackOfferMessage({ offer })
  //     })
  //
  //     await slackAPI('chat.postMessage', expiredOffersHeader)
  //
  //     return Promise.all(
  //       messages.map(async (message) => {
  //         return slackAPI('chat.postMessage', message)
  //       })
  //     )
  //   } catch (e) {
  //     console.log(e)
  //     throw e
  //   }
  // }),
})
