import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { InlineEditButtons } from './InlineEditButtons'
import { useEditClimberNotes } from '../hooks/climber/useEditClimberNotes';

interface Props {
  originalNotes: string | null;
  climberId: string;
  onRequestClose: () => void;
}

export default function ClimberEditNotes({ originalNotes, climberId, onRequestClose }: Props) {
  const [notes, setNotes] = useState(originalNotes)
  const editNotes = useEditClimberNotes()
  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label
        htmlFor='offerNotes'
        className='mx-auto inline p-2 text-center text-xl font-bold'
      >
        Editing Climber Notes
      </label>
      <form
        className='flex items-center justify-center'
        onSubmit={(e) => {
          e.preventDefault()
          editNotes.mutate({
            notes: notes ?? '',
            climberId: climberId,
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
          name='offerNotes'
        ></textarea>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
