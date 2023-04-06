import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import capitalize from "../../../utils/capitalize";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const climberRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid().nullable(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          return null;
        }
        return await ctx.prisma.climber.findUnique({
          where: {
            id: input.id,
          },
          include: {
            classes: {
              include: {
                offers: true,
                climbers: true,
              },
            },
            offers: true,
            waitlistEntries: {
              include: {
                climber: true,
                gym: true,
              },
            },
            logs: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getCampInfo: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.findUnique({
          where: {
            id: input.climberId,
          },
          include: {
            campWeeks: {
              include: {
                gym: true,
                climbers: true,
                campOffers: true,
              },
            },
            campWaitlistEntries: {
              include: {
                gym: {
                  include: {
                    campWeeks: true,
                  },
                },
                climber: true,
              },
            },
            campOffers: {
              include: {
                campWeek: true,
                gym: true,
                user: true,
              },
            },
            logs: true,
          },
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),

  createClimber: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        parentEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.create({
          data: {
            name: capitalize(input.name),
            parentEmail: input.parentEmail.toLowerCase(),
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002")
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `The climber ${capitalize(
                input.name
              )} with the email ${input.parentEmail.toLowerCase()} already exists`,
            });
        }
        console.log(e);
        throw e;
      }
    }),

  deleteClimber: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        confirm: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const climber = await ctx.prisma.climber.findUnique({
          where: { id: input.id },
          select: { name: true },
        });

        if (!climber) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldn't find that climber!",
          });
        }

        if (climber.name !== input.confirm) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Please enter "${climber.name}" exactly in order to confirm deletion (case sensitive!)`,
          });
        }

        return await ctx.prisma.climber.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  enrollClimber: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        classId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const info = await ctx.prisma.climbingClass.findUnique({
          where: { id: input.classId },
          select: { slots: true, climbers: true },
        });

        if (!info) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldn't find that class",
          });
        }

        const enrolledIds = info.climbers.map((climber) => climber.id);

        if (info.slots - info.climbers.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That class is full",
          });
        } else if (enrolledIds.includes(input.id)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That climber is already enrolled in this class!",
          });
        }

        const offer = await ctx.prisma.offer.findUnique({
          where: {
            climberId_classId: {
              climberId: input.id,
              classId: input.classId,
            },
          },
        });

        if (offer) {
          await ctx.prisma.offer.delete({
            where: {
              id: offer.id,
            },
          });
        }

        return await ctx.prisma.climber.update({
          where: { id: input.id },
          data: {
            id: input.id,
            classes: {
              connect: { id: input.classId },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  unEnrollClimber: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        classId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.update({
          where: { id: input.id },
          data: {
            classes: {
              disconnect: { id: input.classId },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  campEnrollClimber: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        weekId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const week = await ctx.prisma.campWeek.findUnique({
          where: { id: input.weekId },
          include: {
            gym: true,
            climbers: true,
          },
        });
        if (!week) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldn't find that camp week",
          });
        }
        const enrolledIds = week.climbers.map((climber) => climber.id);
        if (week.slots - week.climbers.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That week is full",
          });
        } else if (enrolledIds.includes(input.id)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That climber is already enrolled in this week!",
          });
        }
        // If this is the last remaining slot, send Sydney a DM to remind her to
        // mark this week as full on the website
        // if (week.slots - week.climbers.length === 1) {
        //   console.log(`DMing Sydney...`);
        //   await slackAPI("chat.postMessage", sydneyCampAlert(week));
        //   console.log(`Alerting team...`);
        //   await slackAPI(`chat.postMessage`, campFullMessage(week));
        // }
        return await ctx.prisma.climber.update({
          where: { id: input.id },
          data: {
            id: input.id,
            campWeeks: {
              connect: { id: input.weekId },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  campUnEnrollClimber: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        weekId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.update({
          where: { id: input.id },
          data: {
            campWeeks: {
              disconnect: { id: input.weekId },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  searchForClimber: protectedProcedure
    .input(
      z.object({
        searchTerm: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.findMany({
          where: {
            name: {
              search: input.searchTerm,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.climber.findMany({
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

  updateParentEmail: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        parentEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.update({
          where: { id: input.climberId },
          data: {
            parentEmail: input.parentEmail,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.update({
          where: { id: input.climberId },
          data: {
            name: input.name,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }),

  updateNotes: protectedProcedure
    .input(
      z.object({
        climberId: z.string().cuid(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.climber.update({
          where: { id: input.climberId },
          data: {
            notes: input.notes,
          },
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
});
