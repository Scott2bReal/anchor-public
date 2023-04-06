import { TRPCClientError } from "@trpc/client"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { api } from "../../utils/api"
import useLogger from "../useLogger"

interface Props {
  onRequestClose: () => void
  climberId: string
}

export const useMakeCampOffer = ({onRequestClose, climberId}: Props) => {
  const ctx = api.useContext()
  const logger = useLogger()
  const {data: session} = useSession()
  const user = session?.user?.name

  return api.campOffer.createOffer.useMutation({
    onMutate: async () => {
      toast.loading('Creating offer...')
      await ctx.gym.getCampWeeksById.cancel()
      await ctx.climber.getById.cancel()
      await ctx.campOffer.getAllByGymAndYear.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
      await ctx.climber.getById.invalidate()
      await ctx.campOffer.getAllByGymAndYear.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Offer made!')
      onRequestClose()
      logger.mutate({
        climberId: climberId,
        message: `${user ?? 'Someone'} - Made offer for camp week`
      })
    },
    onError: (e) => {
      toast.dismiss()
      if (e instanceof TRPCClientError) {
        toast.error(`Unable to create offer: ${e.message}`)
      } else {
        toast.error(`Unable to create offer: ${e.message}`)
      }
    },
  })
}
