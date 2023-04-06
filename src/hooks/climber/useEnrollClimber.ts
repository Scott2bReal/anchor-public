import type { Climber, ClimbingClass } from "@prisma/client"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { api } from "../../utils/api"
import { useGetOfferByClimberAndClass } from "../offer/useGetOfferByClimberAndClass"
import useDeleteOffer from "../useDeleteOffer"
import useLogger from "../useLogger"
import { useGetEntriesForClimberAndClassType } from "../waitlist-hooks/useGetEntriesForClimberAndClassType"
import useRemoveFromWaitlist from "../waitlist-hooks/useRemoveFromWaitlist"

interface Props {
  climbingClass: ClimbingClass
  climber: Climber
}

export const useEnrollClimber = ({ climbingClass, climber }: Props) => {
  // Queries
  const { data: session } = useSession()
  const user = session?.user
  const { data: offer } = useGetOfferByClimberAndClass({
    climberId: climber.id,
    classId: climbingClass.id
  })
  const { data: waitlistEntry } = useGetEntriesForClimberAndClassType({
    climberId: climber.id,
    gymId: climbingClass.gymId,
    classType: climbingClass.className,
  })

  // Mutations
  const ctx = api.useContext()
  const removeFromWaitlist = useRemoveFromWaitlist({ classType: climbingClass.className })
  const deleteOffer = useDeleteOffer(null)
  const logger = useLogger()

  return api.climber.enrollClimber.useMutation({
    onMutate: async () => {
      toast.loading('Enrolling climber...')
      await ctx.offer.getByGym.cancel()
      await ctx.gym.getById.cancel()
      await ctx.offer.getByClimberAndClass.cancel()
      await ctx.offer.getById.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.offer.getByGym.invalidate()
      await ctx.gym.getById.invalidate()
      await ctx.offer.getByClimberAndClass.invalidate()
      await ctx.offer.getById.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      if (offer) {
        deleteOffer.mutate({ offerId: offer.id })
        logger.mutate({
          climberId: climber.id,
          message: `${offer.user.name ?? 'Someone'} - Rescinded offer`
        })

      }
      if (waitlistEntry) {
        removeFromWaitlist.mutate({ waitlistId: waitlistEntry.id })
      }
      toast.success('Enrolled climber!')
      logger.mutate({
        climberId: climber.id,
        message: `${user?.name ?? 'Someone'} - Enrolled in a ${climbingClass?.className} class`
      })
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })
}
