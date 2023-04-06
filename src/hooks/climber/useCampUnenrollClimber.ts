import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useCampUnenrollClimber = () => {
const ctx = api.useContext()
return api.climber.campUnEnrollClimber.useMutation({
    onMutate: async () => {
      toast.loading('Unenrolling climber...')
      await ctx.gym.getCampWeeksById.cancel()
      await ctx.climber.getCampInfo.cancel()
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
      await ctx.gym.getCampWeeksById.invalidate()
      await ctx.climber.getCampInfo.invalidate()
    },
  })
}
