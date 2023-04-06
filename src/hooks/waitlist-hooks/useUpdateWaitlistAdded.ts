import toast from "react-hot-toast"
import { api } from "../../utils/api"

export default function useUpdateWaitlistAdded() {
  const ctx = api.useContext()
  return api.waitlist.updateAdded.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.waitlist.getEntriesForGym.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Updated date added')
    },
    onError: (e) => {
      toast.error(`Error updating date added: ${e.message}`)
    }
  })
}
