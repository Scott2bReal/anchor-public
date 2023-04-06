import toast from "react-hot-toast"
import { api } from "../../utils/api"

export const useUpdateCampPriority = () => {
  const ctx = api.useContext()
  return api.campWaitlist.updatePriority.useMutation({
    onMutate: async () => {
      toast.loading(`Updating priority...`)
      await ctx.campWaitlist.getByGymAndYear.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.campWaitlist.getByGymAndYear.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Updated priority')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating priority: ${e.message}`)
    }
  })
}
