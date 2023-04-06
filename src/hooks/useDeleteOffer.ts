import type { Climber, ClimbingClass, Offer, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { api } from "../utils/api"
import useLogger from "./useLogger"

const useDeleteOffer = (offer: (
  Offer & {
    climber: Climber,
    user: User,
    climbingClass: ClimbingClass,
  }
) | null,
) => {
  const ctx = api.useContext()
  const logger = useLogger()
  const session = useSession()

  const currentUserName = session?.data?.user?.name ?? 'Someone'

  return api.offer.deleteOffer.useMutation({
    onMutate: async () => {
      toast.loading('Deleting offer...')
      await ctx.gym.getById.cancel()
      await ctx.offer.getByGym.cancel()
      await ctx.climber.getById.cancel()
      await ctx.offer.getById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getById.invalidate()
      await ctx.offer.getByGym.invalidate()
      await ctx.climber.getById.invalidate()
      await ctx.offer.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Deleted the corresponding offer")

      if (offer) {
        logger.mutate({
          climberId: offer.climberId,
          message: `${currentUserName} - Rescinded offer`
        })
      }
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })

}

export default useDeleteOffer
