import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { formatDateFromInput } from "../utils/formatDateFromInput";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type OfferEditExpirationProps = {
  offerId: string;
  originalExpiration: Date;
  onRequestClose: () => void;
}

export const OfferEditExpiration = ({offerId, originalExpiration, onRequestClose}: OfferEditExpirationProps) => {
  const [expiration, setExpiration] = useState(originalExpiration)
  const ctx = trpc.useContext()

  const editExpiration = trpc.offers.updateExpiration.useMutation({
    onMutate: async () => {
      await ctx.offers.getById.cancel()
      await ctx.offers.getByClass.cancel()
    },
    onSettled: () => {
      ctx.offers.getById.invalidate()
      ctx.offers.getByClass.invalidate()
    },
    onSuccess: () => toast.success("Updated expiration!"),
    onError: (e) => toast.error(`Unable to edit expiration: ${e.message}`)
  })

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='offerNotes' className='font-bold'>Edit Expiration</label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editExpiration.mutate({
            offerId: offerId,
            expiration: expiration,
          })
          onRequestClose()
        }}
        className='inline p-2'
        name='entryDate'
        ref={formRef}
      >
        <input
          type='date'
          onChange={(e) => setExpiration(formatDateFromInput(e.target.value))}
          autoFocus
          className='text-neutral-900 px-2 py-1 rounded-lg'
        />
      <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>

  )
}
