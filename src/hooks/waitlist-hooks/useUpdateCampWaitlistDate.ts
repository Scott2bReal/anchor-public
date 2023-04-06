import toast from "react-hot-toast"
import { api } from "../../utils/api"

export const useUpdateCampWaitlistAdded = () => {
  const ctx = api.useContext()
  return api.campWaitlist.updateAdded.useMutation({
    onMutate: async () => {
      toast.loading(`Updating date added`)
      await ctx.campWaitlist.getByGymAndYear.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.campWaitlist.getByGymAndYear.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Updated date added')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating date added: ${e.message}`)
    }
  })
}
