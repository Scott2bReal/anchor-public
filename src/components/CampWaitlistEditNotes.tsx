import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useOnClickOutside } from 'usehooks-ts'
import { api } from '../utils/api'
import { InlineEditButtons } from './InlineEditButtons'

type Props = {
  entryId: string
  originalNotes: string | null
  onRequestClose: () => void
}

export const CampWaitlistEditNotes = ({
  entryId,
  originalNotes,
  onRequestClose,
}: Props) => {
  const [notes, setNotes] = useState(originalNotes)
  const ctx = api.useContext()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateNotes = api.campWaitlist.updateNotes.useMutation({
    onMutate: async () => {
      await ctx.campWaitlist.getByGymAndYear.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.campWaitlist.getByGymAndYear.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Updated notes')
    },
    onError: (e) => {
      toast.error(`Error updating notes: ${e.message}`)
    },
  })

  return (
    <>
      <label
        htmlFor='waitlistNotes'
        className='mx-auto inline p-2 text-center text-xl font-bold'
      >
        Editing Waitlist Notes
      </label>
      <form
        className='flex items-center justify-center'
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
          className='m-2 rounded-lg px-2 py-1 text-neutral-900'
          autoFocus
          name='waitlistNotes'
        ></textarea>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
