import toast from "react-hot-toast";
import { trpc } from "../utils/trpc";

export default function useLogger() {
  const ctx = trpc.useContext()

  return trpc.logger.climberLog.useMutation({
    onMutate: async () => {
      await ctx.climber.getById.cancel()
      await ctx.logger.getClimberLogs.cancel()
    },
    onSettled: () => {
      ctx.climber.getById.invalidate()
      ctx.logger.getClimberLogs.invalidate()
    },
    onError: (e) => {
      toast.error(`Error adding log entry: ${e.message}`)
    }
  })
}
