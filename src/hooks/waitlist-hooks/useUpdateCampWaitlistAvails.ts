import type { Climber } from "@prisma/client"
import toast from "react-hot-toast"
import { api } from "../../utils/api"

export const useUpdateCampWaitlistAvails = (climber: Climber) => {
const ctx = api.useContext()

return api.campWaitlist.updateAvailability.useMutation({
    onMutate: async () => {
      toast.loading(`Updating availability...`)
      await ctx.campWaitlist.getByGymAndYear.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.campWaitlist.getByGymAndYear.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Updated availability for ${climber?.name}`)
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error updating availability: ${e.message}`)
    },
  })
}
