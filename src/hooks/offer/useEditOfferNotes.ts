import { toast } from "react-hot-toast"
import { api } from "../../utils/api"

export const useEditOfferNotes = () => {
  const ctx = api.useContext()
  return api.offer.updateNotes.useMutation({
    onMutate: async () => {
      toast.loading("Updating notes...")
      await ctx.offer.getById.cancel()
      await ctx.offer.getByClass.cancel()
    },
    onSettled: async () => {
      await ctx.offer.getById.invalidate()
      await ctx.offer.getByClass.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Updated notes!")
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to edit notes: ${e.message}`)
    }
  })
}
