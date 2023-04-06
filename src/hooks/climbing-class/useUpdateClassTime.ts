import { toast } from "react-hot-toast";
import { api } from "../../utils/api";

export const useUpdateClassTime = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.climbingClass.updateTime.useMutation({
    onMutate: async () => {
      toast.loading(`Updating class start time...`)
      await ctx.gym.getForClassInfo.cancel();
      await ctx.gym.getById.cancel();
    },
    onSettled: async () => {
      await ctx.gym.getForClassInfo.invalidate();
      await ctx.gym.getById.invalidate();
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Start time updated")
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating start time: ${e.message}`)
    }
  })

}
