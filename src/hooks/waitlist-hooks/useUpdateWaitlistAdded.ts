import toast from "react-hot-toast"
import { trpc } from "../../utils/trpc"

export default function useUpdateWaitlistAdded() {
  const ctx = trpc.useContext()
  return trpc.waitlist.updateAdded.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.waitlist.getEntriesForGym.invalidate()
      ctx.climber.getById.invalidate()

    },
    onSuccess: () => {
      toast.success('Updated date added')
    },
    onError: (e) => {
      toast.error(`Error updating date added: ${e.message}`)
    }
  })
}
