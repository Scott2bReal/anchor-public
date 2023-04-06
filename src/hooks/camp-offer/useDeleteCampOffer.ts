import type { CampOffer } from "@prisma/client"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { api } from "../../utils/api"
import useLogger from "../useLogger"

interface Props {
  campOffer: CampOffer | null | undefined
}
export const useDeleteCampOffer = ({campOffer}: Props) => {
  const ctx = api.useContext()
  const logger = useLogger()
  const session = useSession()

  const currentUserName = session?.data?.user?.name ?? 'Someone'

  return api.campOffer.delete.useMutation({
    onMutate: async () => {
      toast.loading('Deleting offer...')
      await ctx.gym.getCampWeeksById.cancel()
      await ctx.campOffer.getByWeek.cancel()
      await ctx.climber.getCampInfo.cancel()
      await ctx.climber.getById.cancel()
      await ctx.campOffer.getById.cancel()
      await ctx.campOffer.getAllByGymAndYear.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
      await ctx.campOffer.getByWeek.invalidate()
      await ctx.climber.getCampInfo.invalidate()
      await ctx.climber.getById.invalidate()
      await ctx.campOffer.getById.invalidate()
      await ctx.campOffer.getAllByGymAndYear.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Deleted the corresponding offer")

      if (campOffer) {
        logger.mutate({
          climberId: campOffer.climberId,
          message: `${currentUserName} - Rescinded camp offer`
        })
      }
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })

}
