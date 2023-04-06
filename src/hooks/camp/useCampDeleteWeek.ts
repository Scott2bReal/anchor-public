import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useCampDeleteWeek = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.campWeek.remove.useMutation({
    onMutate: async () => {
      toast.loading('Removing class...')
      await ctx.gym.getCampWeeksById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Camp Week deleted")
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })
}
