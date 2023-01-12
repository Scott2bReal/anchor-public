import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type WaitlistEditNotesProps = {
  entryId: string;
  originalNotes: string | null;
  onRequestClose: () => void;
}

const WaitlistEditNotes = ({entryId, originalNotes, onRequestClose}: WaitlistEditNotesProps) => {
  const [notes, setNotes] = useState(originalNotes)
  const ctx = trpc.useContext()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateNotes = trpc.waitlist.updateNotes.useMutation({
    onMutate: async () => {
      await ctx.waitlist.getEntriesForGym.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.waitlist.getEntriesForGym.invalidate()
      ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success("Updated notes")
    },
    onError: (e) => {
      toast.error(`Error updating notes: ${e.message}`)
    }
  })

  return (
    <>
      <label htmlFor='waitlistNotes' className='text-xl font-bold mx-auto text-center inline p-2'>Editing Waitlist Notes</label>
      <form
        className='flex justify-center items-center'
        onSubmit={(e) => {
          e.preventDefault()
          updateNotes.mutate({
            notes: notes,
            entryId: entryId,
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
          name='waitlistNotes'
        ></textarea>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>

  )
}

export default WaitlistEditNotes
