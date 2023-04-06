import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useCampUpdateInstructor } from '../hooks/camp/useCampUpdateInstructor'
import { InlineEditButtons } from './InlineEditButtons'

interface Props {
  weekId: string
  originalInstructor: string
  onRequestClose: () => void
}

export const CampWeekEditInstructor = ({
  weekId,
  originalInstructor,
  onRequestClose,
}: Props) => {
  const [instructor, setInstructor] = useState(originalInstructor)

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateInstructor = useCampUpdateInstructor()

  return (
    <form
      className='flex items-center gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        updateInstructor.mutate({
          weekId: weekId,
          instructor: instructor,
        })
        onRequestClose()
      }}
      ref={formRef}
    >
      <input
        onChange={(e) => setInstructor(e.target.value)}
        placeholder={originalInstructor}
        className='rounded-lg px-1 text-neutral-900 shadow-md shadow-neutral-900'
        autoFocus
      />
      <InlineEditButtons onRequestClose={onRequestClose} />
    </form>
  )
}
