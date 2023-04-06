import { toast } from 'react-hot-toast'
import { api } from '../../utils/api'

export const useCopyClassToUpcomingSession = () => {
  const ctx = api.useContext()

  return api.climbingClass.copyClass.useMutation({
    onMutate: async () => {
      toast.loading('Copying class to upcoming session...')
      await ctx.gym.getAll.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getAll.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Class copied to upcoming session')
    },
  })
}
