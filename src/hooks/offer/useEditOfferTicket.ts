import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useEditOfferTicket = () => {
  const ctx = api.useContext()
  return api.offer.updateZendeskTicket.useMutation({
    onMutate: async () => {
      await ctx.offer.getById.cancel()
      await ctx.offer.getByClass.cancel()
    },
    onSettled: async () => {
      await ctx.offer.getById.invalidate()
      await ctx.offer.getByClass.invalidate()
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
