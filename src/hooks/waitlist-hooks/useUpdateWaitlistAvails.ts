import toast from "react-hot-toast"
import { trpc } from "../../utils/trpc"
import useFindClimber from "../useFindClimber"

export default function useUpdateWaitlistAvails(climberId: string) {
const ctx = trpc.useContext()
const { data: climber } = useFindClimber(climberId)

return trpc.waitlist.updateAvailability.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.waitlist.getEntriesForGym.invalidate()
      ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success(`Updated availability for ${climber?.name}`)
    },
    onError: (e) => {
      toast.error(`Error updating availability: ${e.message}`)
    },
  })
}
