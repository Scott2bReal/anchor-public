import type { ClimbingClass } from "@prisma/client"
import { TRPCClientError } from "@trpc/client"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { api } from "../../utils/api"
import useLogger from "../useLogger"

interface Props {
  climberId: string
  climbingClass: ClimbingClass
  onRequestClose: () => void
}

export const useMakeOffer = ({climberId, climbingClass, onRequestClose}: Props) => {
  const ctx = api.useContext()
  const logger = useLogger()
  const {data: session} = useSession()
  const user = session?.user?.name

  return api.offer.createOffer.useMutation({
    onMutate: async () => {
      toast.loading('Creating offer...')
      await ctx.gym.getById.cancel()
      await ctx.climber.getById.cancel()
      await ctx.offer.getByClass.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getById.invalidate()
      await ctx.climber.getById.invalidate()
      await ctx.offer.getByClass.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Offer made!')
      onRequestClose()
      logger.mutate({
        climberId: climberId,
        message: `${user ?? 'Someone'} - Offer for a ${climbingClass.className} class`
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
