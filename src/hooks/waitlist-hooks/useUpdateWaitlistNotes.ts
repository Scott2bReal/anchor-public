import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useUpdateWaitlistNotes = () => {
  const ctx = api.useContext()
  return api.waitlist.updateNotes.useMutation({
    onMutate: async () => {
      toast.loading(`Updating waitlist entry notes...`)
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.waitlist.getEntriesForGym.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Updated notes")
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating notes: ${e.message}`)
    }
  })
}
