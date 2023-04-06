import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useCampCreateNewYear = (onRequestClose: () => void) => {
  const ctx = api.useContext()
  return api.campWeek.createCampYear.useMutation({
    onMutate: async () => {
      toast.loading(`Creating new camp year...`)
      await ctx.campWeek.getYears.cancel()
    },
    onSettled: async () => {
      await ctx.campWeek.getYears.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Created new camp year`)
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error creating new camp year: ${e.message}`)
    }
  })
}
