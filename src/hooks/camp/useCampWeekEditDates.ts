import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useCampWeekEditDates = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.campWeek.editDates.useMutation({
    onMutate: async () => {
      toast.loading(`Changing camp week number...`)
      await ctx.gym.getCampWeeksById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Updated camp week number`)
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error: ${e.message}`)
    }
  })

}
