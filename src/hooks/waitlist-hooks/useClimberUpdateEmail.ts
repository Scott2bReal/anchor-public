import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useClimberUpdateEmail = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.climber.updateParentEmail.useMutation({

    onMutate: async () => {
      toast.loading(`Updating parent email...`)
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Updated climber\' parent email')
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating name: ${e.message}`)
    }
  })

}
