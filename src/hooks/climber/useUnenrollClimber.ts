import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useUnenrollClimber = () => {
  const ctx = api.useContext()
  return api.climber.unEnrollClimber.useMutation({
      onMutate: async () => {
        toast.loading('Unenrolling climber...')
        await ctx.gym.getById.cancel()
        await ctx.climber.getById.cancel()
      },
      onSuccess: () => {
        toast.dismiss()
        toast.success("Unenrolled climber!")
      },
      onError: () => {
        toast.dismiss()
        toast.error("Unable to unenroll climber")
      },
      onSettled: async () => {
        await ctx.gym.getById.invalidate()
        await ctx.climber.getById.invalidate()
      },
    })
}
