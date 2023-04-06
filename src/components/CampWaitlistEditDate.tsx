import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useUpdateCampWaitlistAdded } from '../hooks/waitlist-hooks/useUpdateCampWaitlistDate'
import { formatDateFromInput } from '../utils/formatDateFromInput'
import { InlineEditButtons } from './InlineEditButtons'

type Props = {
  entryId: string
  originalDate: Date
  onRequestClose: () => void
}

export const CampWaitlistEditDate = ({
  entryId,
  originalDate,
  onRequestClose,
}: Props) => {
  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())
  const updateAdded = useUpdateCampWaitlistAdded()
  const [added, setAdded] = useState(originalDate)

  return (
    <>
      <label htmlFor='entryDate' className='inline text-xl font-bold'>
        Edit Date Added:{' '}
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateAdded.mutate({
            entryId: entryId,
            newAdded: added,
          })
          onRequestClose()
        }}
        className='inline p-2'
        name='entryDate'
        ref={formRef}
      >
        <input
          type='date'
          autoFocus
          onChange={(e) => setAdded(formatDateFromInput(e.target.value))}
          className='rounded-lg px-2 py-1 text-neutral-900'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
