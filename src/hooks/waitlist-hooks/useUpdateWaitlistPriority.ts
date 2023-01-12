import toast from "react-hot-toast"
import { trpc } from "../../utils/trpc"

export default function useUpdateWaitlistPriority() {
  const ctx = trpc.useContext()
  return trpc.waitlist.updatePriority.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.waitlist.getEntriesForGym.invalidate()
      ctx.climber.getById.invalidate()

    },
    onSuccess: () => {
      toast.success('Updated priority')
    },
    onError: (e) => {
      toast.error(`Error updating priority: ${e.message}`)
    }
  })
}
