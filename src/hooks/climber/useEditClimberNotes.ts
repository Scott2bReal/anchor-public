import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export function useEditClimberNotes() {
  const ctx = api.useContext()
  return api.climber.updateNotes.useMutation({
    onMutate: async () => {
      toast.loading(`Editing climber notes...`)
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Updated climber notes')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating notes: ${e.message}`)
    }
  })
}
