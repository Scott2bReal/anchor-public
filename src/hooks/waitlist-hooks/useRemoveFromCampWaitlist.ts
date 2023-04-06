import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api } from "../../utils/api";
import { campYearAtom } from "../../utils/atoms/campYearAtom";
import useLogger from "../useLogger";

type Props = {
  gymName: string
};

export function useRemoveFromCampWaitlist({ gymName }: Props) {
  const ctx = api.useContext()
  const logger = useLogger()
  const { data: session } = useSession()
  const user = session?.user
  const [year] = useAtom(campYearAtom)

  return api.campWaitlist.remove.useMutation({
    onMutate: async () => {
      toast.loading('Removing from waitlist...')
      await ctx.campWaitlist.getByGymAndYear.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.campWaitlist.getByGymAndYear.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: ({ climberId }) => {
      toast.dismiss()
      toast.success(`Removed climber from camp waitlist`)

      logger.mutate({
        climberId: climberId,
        // There will always be a user...
        message: `${user?.name ? user.name : 'Someone'} - Removed from the ${year} ${gymName} camp waitlist`,
      })
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to remove climber from waitlist: ${e.message}`)
    }
  })
}
