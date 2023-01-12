import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type SessionEditNotesProps = {
  sessionId: string;
  originalNotes: string | null;
  onRequestClose: () => void;
}

export const SessionEditNotes = ({sessionId, originalNotes, onRequestClose}: SessionEditNotesProps) => {
  const [notes, setNotes] = useState(originalNotes ?? '')
  const ctx = trpc.useContext()

  const editNotes = trpc.climbingSession.updateNotes.useMutation({
    onMutate: async () => {
      await ctx.climbingSession.getAll.cancel()
      await ctx.climbingSession.getCurrent.cancel()
      await ctx.climbingSession.getById.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
      ctx.climbingSession.getCurrent.invalidate()
      ctx.climbingSession.getById.invalidate()
    },
    onSuccess: () => toast.success("Updated notes! Refresh the page to see changes until I figure out how to get them to show up 😅", {
      duration: 5000,
    }),
    onError: (e) => toast.error(`Unable to edit notes: ${e.message}`)
  })

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='sessionNotes' className='text-xl font-bold mx-auto text-center inline p-2'>Editing Session Notes</label>
      <form
        className='flex justify-center items-center'
        onSubmit={(e) => {
          e.preventDefault()
          editNotes.mutate({
            notes: notes,
            id: sessionId,
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
          name='sessionNotes'
        ></textarea>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>

  )
}
