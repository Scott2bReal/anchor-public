import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useEditOfferExpiration = () => {
  const ctx = api.useContext()
  return api.offer.updateExpiration.useMutation({
    onMutate: async () => {
      toast.loading(`Editing expiration...`)
      await ctx.offer.getById.cancel()
      await ctx.offer.getByClass.cancel()
    },
    onSettled: async () => {
      await ctx.offer.getById.invalidate()
      await ctx.offer.getByClass.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Updated expiration!")
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to edit expiration: ${e.message}`)
    }
  })
}
