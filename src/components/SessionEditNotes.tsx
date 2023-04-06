import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useEditSessionNotes } from '../hooks/climbing-session/useEditSessionNotes'
import { InlineEditButtons } from './InlineEditButtons'

type SessionEditNotesProps = {
  sessionId: string
  originalNotes: string | null
  onRequestClose: () => void
}

export const SessionEditNotes = ({
  sessionId,
  originalNotes,
  onRequestClose,
}: SessionEditNotesProps) => {
  const [notes, setNotes] = useState(originalNotes ?? '')

  const editNotes = useEditSessionNotes()
  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label
        htmlFor='sessionNotes'
        className='mx-auto inline p-2 text-center text-xl font-bold'
      >
        Editing Session Notes
      </label>
      <form
        className='flex items-center justify-center'
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
          className='m-2 rounded-lg px-2 py-1 text-neutral-900'
          autoFocus
          name='sessionNotes'
        ></textarea>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
