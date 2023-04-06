import toast from "react-hot-toast";
import { api } from "../utils/api";

export default function useLogger() {
  const ctx = api.useContext()

  return api.log.climberLog.useMutation({
    onMutate: async () => {
      await ctx.climber.getById.cancel()
      await ctx.log.getClimberLogs.cancel()
    },
    onSettled: async () => {
      await ctx.climber.getById.invalidate()
      await ctx.log.getClimberLogs.invalidate()
    },
    onError: (e) => {
      toast.error(`Error adding log entry: ${e.message}`)
    }
  })
}
