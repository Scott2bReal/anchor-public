import type { CampWeek } from "@prisma/client"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { api } from "../../utils/api"
import { useDeleteCampOffer } from "../camp-offer/useDeleteCampOffer"
import { useGetCampOfferByClimberAndWeek } from "../camp-offer/useGetCampOfferByClimberAndWeek"
import { useGetBasicGymInfo } from "../gym/useGetBasicGymInfo"
import useLogger from "../useLogger"
import { useGetCampWaitlistByClimber } from "../waitlist-hooks/useGetCampWaitlistByClimber"
import { useRemoveFromCampWaitlist } from "../waitlist-hooks/useRemoveFromCampWaitlist"

interface Props {
  campWeek: CampWeek
  climberId: string
}

export const useCampEnrollClimber = ({ campWeek, climberId }: Props) => {
  const ctx = api.useContext()

  // Queries
  const { data: session } = useSession()
  const user = session?.user
  const logger = useLogger()
  const { gymId } = campWeek
  const { data: gymInfo } = useGetBasicGymInfo(gymId)
  const { data: campOffer } = useGetCampOfferByClimberAndWeek({ weekId: campWeek.id, climberId: climberId })
  const { data: entries } = useGetCampWaitlistByClimber(climberId)
  const waitlistEntry = entries?.find(entry => entry.gymId === gymId && entry.year === campWeek.year)

  // Mutations
  const removeFromWaitlist = useRemoveFromCampWaitlist({ gymName: gymInfo?.name ?? 'A gym' })
  const deleteCampOffer = useDeleteCampOffer({ campOffer: campOffer })

  return api.climber.campEnrollClimber.useMutation({
    onMutate: async () => {
      toast.loading('Enrolling climber...')
      await ctx.gym.getCampWeeksById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      if (campOffer) {
        deleteCampOffer.mutate({ campOfferId: campOffer.id })
        logger.mutate({
          climberId: climberId,
          message: `${user?.name ?? 'Someone'} - Rescinded offer`
        })
      }

      if (waitlistEntry) {
        removeFromWaitlist.mutate({ id: waitlistEntry.id })
      }

      toast.success('Enrolled climber!')

      logger.mutate({
        climberId: climberId,
        message: `${user?.name ? user.name : 'Someone'} - Enrolled in camp week ${campWeek.weekNumber} - ${campWeek.year} at ${gymInfo?.name ? gymInfo.name : 'a gym'}`
      })
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })
}
