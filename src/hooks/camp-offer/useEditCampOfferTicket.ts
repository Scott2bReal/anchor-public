import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useEditCampOfferTicket = () => {
  const ctx = api.useContext()
  return api.campOffer.updateZendeskTicket.useMutation({
    onMutate: async () => {
      toast.loading(`Updating zendesk ticket`)
      await ctx.climber.getCampInfo.cancel()
      await ctx.gym.getCampWeeksById.cancel()
      await ctx.campOffer.getById.cancel()
      await ctx.campOffer.getByWeek.cancel()
    },
    onSettled: async () => {
      await ctx.climber.getCampInfo.invalidate()
      await ctx.gym.getCampWeeksById.invalidate()
      await ctx.campOffer.getById.invalidate()
      await ctx.campOffer.getByWeek.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Updated Zendesk ticket!")
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to edit Zendesk ticket: ${e.message}`)
    }
  })
}
