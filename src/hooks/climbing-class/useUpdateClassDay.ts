import { toast } from "react-hot-toast";
import { api } from "../../utils/api";

interface Props {
  onRequestClose: () => void
  newDay: string
}

export const useUpdateClassDay = ({onRequestClose, newDay}: Props) => {

const ctx = api.useContext()
return api.climbingClass.updateDay.useMutation({
    onMutate: async () => {
      toast.loading(`Updating class day...`)
      await ctx.gym.getForClassInfo.cancel();
      await ctx.gym.getById.cancel();
    },
    onSettled: async () => {
      await ctx.gym.getForClassInfo.invalidate();
      await ctx.gym.getById.invalidate();
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Class switched to ${newDay}`)
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error changing class day: ${e.message}`)
    }
  })
}
