import { toast } from "react-hot-toast"
import { trpc } from "../utils/trpc"


export const useSetUserDefaultSession = () => {
  const ctx = trpc.useContext()
  return trpc.user.setDefaultSession.useMutation({
    onMutate: async () => {
      toast.loading(`Setting your default session...`)
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Changed your default session`)
    }
  })
}
