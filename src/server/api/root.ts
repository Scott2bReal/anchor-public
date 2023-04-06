import { campOfferRouter } from "./routers/campOfferRouter";
import { campWaitlistRouter } from "./routers/campWaitlistRouter";
import { campWeekRouter } from "./routers/campWeekRouter";
import { climberRouter } from "./routers/climberRouter";
import { climbingClassRouter } from "./routers/climbingClassRouter";
import { climbingSessionRouter } from "./routers/climbingSessionRouter";
import { gymRouter } from "./routers/gymRouter";
import { logRouter } from "./routers/logRouter";
import { offerRouter } from "./routers/offerRouter";
import { userRouter } from "./routers/userRouter";
import { waitlistRouter } from "./routers/waitlistRouter";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  campOffer: campOfferRouter,
  campWaitlist: campWaitlistRouter,
  campWeek: campWeekRouter,
  climber: climberRouter,
  climbingClass: climbingClassRouter,
  climbingSession: climbingSessionRouter,
  gym: gymRouter,
  log: logRouter,
  offer: offerRouter,
  user: userRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
