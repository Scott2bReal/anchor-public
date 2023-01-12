import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type OfferEditNotesProps = {
  offerId: string;
  originalNotes: string;
  onRequestClose: () => void;
}

const OfferEditNotes = ({offerId, originalNotes, onRequestClose}: OfferEditNotesProps) => {
  const [notes, setNotes] = useState(originalNotes)
  const ctx = trpc.useContext()

  const editNotes = trpc.offers.updateNotes.useMutation({
    onMutate: async () => {
      toast.loading("Updating notes...")
      await ctx.offers.getById.cancel()
      await ctx.offers.getByClass.cancel()
    },
    onSettled: () => {
      ctx.offers.getById.invalidate()
      ctx.offers.getByClass.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Updated notes!")
    },
    onError: (e) => toast.error(`Unable to edit notes: ${e.message}`)
  })

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='offerNotes' className='text-xl font-bold mx-auto text-center inline p-2'>Editing Offer Notes</label>
      <form
        className='flex justify-center items-center'
        onSubmit={(e) => {
          e.preventDefault()
          editNotes.mutate({
            notes: notes,
            offerId: offerId,
          })
          onRequestClose()
        }}
        ref={formRef}
      >
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          defaultValue={notes ?? ''}
          className='text-neutral-900 m-2 px-2 py-1 rounded-lg'
          autoFocus
          name='offerNotes'
        ></textarea>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>

  )
}

export default OfferEditNotes
