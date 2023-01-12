import { Climber, ClimbingClass, Offer, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { trpc } from "../utils/trpc"
import useLogger from "./useLogger"

const useDeleteOffer = (offer: (
  Offer & {
    climber: Climber,
    user: User,
    climbingClass: ClimbingClass,
  }
) | null,
) => {
  const ctx = trpc.useContext()
  const logger = useLogger()
  const session = useSession()

  const currentUserName = session?.data?.user?.name ?? 'Someone'

  return trpc.offers.deleteOffer.useMutation({
    onMutate: async () => {
      toast.loading('Deleting offer...')
      await ctx.gyms.getById.cancel()
      await ctx.offers.getByGym.cancel()
      await ctx.climber.getById.cancel()
      await ctx.offers.getById.cancel()
    },
    onSettled: () => {
      ctx.gyms.getById.invalidate()
      ctx.offers.getByGym.invalidate()
      ctx.climber.getById.invalidate()
      ctx.offers.getById.invalidate()
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
