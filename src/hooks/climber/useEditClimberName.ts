import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useEditClimberName = (onRequestClose: () => void) => {

const ctx = api.useContext()
return api.climber.updateName.useMutation({
    onMutate: async () => {
      toast.loading(`Editing climber name...`)
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Updated climber name')
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating name: ${e.message}`)
    }
  })
}
