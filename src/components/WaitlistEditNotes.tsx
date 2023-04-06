import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useUpdateWaitlistNotes } from '../hooks/waitlist-hooks/useUpdateWaitlistNotes'
import { InlineEditButtons } from './InlineEditButtons'

type WaitlistEditNotesProps = {
  entryId: string
  originalNotes: string | null
  onRequestClose: () => void
}

const WaitlistEditNotes = ({
  entryId,
  originalNotes,
  onRequestClose,
}: WaitlistEditNotesProps) => {
  const [notes, setNotes] = useState(originalNotes)

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateNotes = useUpdateWaitlistNotes()

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

export default WaitlistEditNotes
