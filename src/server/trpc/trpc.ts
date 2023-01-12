import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { PrismaClientValidationError } from '@prisma/client/runtime'

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
        prismaError:
        error.code === 'BAD_REQUEST' && error.cause instanceof PrismaClientValidationError
        ? error.message
        : null,
      },
    }
  },
})

export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      // infers that `session` is non-nullable to downstream resolvers
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
