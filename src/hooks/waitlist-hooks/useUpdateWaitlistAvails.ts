import toast from "react-hot-toast"
import { api } from "../../utils/api"
import useFindClimber from "../useFindClimber"

export default function useUpdateWaitlistAvails(climberId: string) {
const ctx = api.useContext()
const { data: climber } = useFindClimber(climberId)

return api.waitlist.updateAvailability.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.waitlist.getEntriesForGym.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success(`Updated availability for ${climber?.name ?? 'a climber'}`)
    },
    onError: (e) => {
      toast.error(`Error updating availability: ${e.message}`)
    },
  })
}
