import toast from "react-hot-toast"
import { api } from "../../utils/api"

export default function useUpdateWaitlistPriority() {
  const ctx = api.useContext()
  return api.waitlist.updatePriority.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.waitlist.getEntriesForGym.invalidate()
      await ctx.climber.getById.invalidate()

    },
    onSuccess: () => {
      toast.success('Updated priority')
    },
    onError: (e) => {
      toast.error(`Error updating priority: ${e.message}`)
    }
  })
}
