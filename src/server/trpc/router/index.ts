// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { campWeekRouter } from "./campWeekRouter";
import { climberRouter } from "./climberRouter";
import { climbingClassRouter } from "./climbingClassRouter";
import { climbingSessionRouter } from "./climbingSessionRouter";
import { gymRouter } from "./gymRouter";
import { logRouter } from "./logRouter";
import { offerRouter } from "./offerRouter";
import { userRouter } from "./userRouter";
import { waitlistRouter } from "./waitlistRouter";

export const appRouter = t.router({
  gyms: gymRouter,
  climbingClass: climbingClassRouter,
  climber: climberRouter,
  waitlist: waitlistRouter,
  offers: offerRouter,
  climbingSession: climbingSessionRouter,
  logger: logRouter,
  user: userRouter,
  campWeek: campWeekRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
