import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useCampUpdateInstructor = () => {
  const ctx = api.useContext()
  return api.campWeek.editInstructor.useMutation({
    onMutate: async () => {
      toast.loading(`Changing instructor...`)
      await ctx.gym.getCampWeeksById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Updated instructor')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating instructor: ${e.message}`)
    }
  })
}
