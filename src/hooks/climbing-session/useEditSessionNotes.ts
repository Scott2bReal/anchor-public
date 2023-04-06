import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useEditSessionNotes = () => {
  const ctx = api.useContext()
  return api.climbingSession.updateNotes.useMutation({
    onMutate: async () => {
      toast.loading(`Editing session notes...`)
      await ctx.climbingSession.getAll.cancel()
      await ctx.climbingSession.getCurrent.cancel()
      await ctx.climbingSession.getById.cancel()
    },
    onSettled: async () => {
      await ctx.climbingSession.getAll.invalidate()
      await ctx.climbingSession.getCurrent.invalidate()
      await ctx.climbingSession.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Updated notes! Refresh the page to see changes until I figure out how to get them to show up 😅`, {
        duration: 5000,
      })
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to edit notes: ${e.message}`)
    }
  })
}
