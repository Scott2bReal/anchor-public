import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { api } from "../../utils/api";
import useLogger from "../useLogger";

type RemoveFromWaitlistProps = {
  classType: string;
};

export default function useRemoveFromWaitlist({ classType }: RemoveFromWaitlistProps) {
  const ctx = api.useContext()
  const logger = useLogger()
  const {data: session} = useSession()
  const user = session?.user

  return api.waitlist.remove.useMutation({
    onMutate: async () => {
      toast.loading('Removing from waitlist...')
      await ctx.waitlist.getEntriesForGym.cancel()
    },
    onSettled: async () => {
      await ctx.waitlist.getEntriesForGym.invalidate()
    },
    onSuccess: ({ climberId }) => {
      toast.dismiss()
      toast.success(`Removed climber from ${classType} waitlist`)

      logger.mutate({
        climberId: climberId,
        // There will always be a user...
        message: `${user?.name ? user.name : 'Someone'} - Removed from the ${classType} waitlist`,
      })
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to remove climber from waitlist: ${e.message}`)
    }
  })
}
