import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useSessionCreate = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.climbingSession.create.useMutation({
    onMutate: async () => {
      toast.loading('Creating session...')
      await ctx.climbingSession.getAll.cancel()
      await ctx.gym.getById.cancel()
    },
    onSettled: async () => {
      await ctx.climbingSession.getAll.invalidate()
      await ctx.gym.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("New session created!")
      onRequestClose();
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })
}
