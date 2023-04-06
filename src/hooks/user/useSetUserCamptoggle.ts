import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useSetUserCampToggle = () => {
  const ctx = api.useContext()
  return api.user.setShowCampPref.useMutation({
      onMutate: async () => {
        toast.loading(`Setting preferences...`)
        await ctx.user.getCurrent.cancel()
      },
      onSettled: async () => {
        await ctx.user.getCurrent.invalidate()
      },
      onSuccess: () => {
        toast.dismiss()
        toast.success(`Changed your preferences`)
      },
      onError: (e) => {
        toast.dismiss()
        toast.error(`Unable to change preferences: ${e.message}`)
      },
    })
}
