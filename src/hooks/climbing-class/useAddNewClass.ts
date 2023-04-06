import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useAddNewClass = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.climbingClass.create.useMutation({
    onMutate: async () => {
      toast.loading('Creating class...')
      await ctx.gym.getById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getById.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Added class to schedule!")
      onRequestClose()
    }
  })
}
