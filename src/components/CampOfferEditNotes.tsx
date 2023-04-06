import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useEditCampOfferNotes } from '../hooks/camp-offer/useEditCampOfferNotes'
import { InlineEditButtons } from './InlineEditButtons'

type Props = {
  campOfferId: string
  originalNotes: string
  onRequestClose: () => void
}

export const CampOfferEditNotes = ({
  campOfferId,
  originalNotes,
  onRequestClose,
}: Props) => {
  const [notes, setNotes] = useState(originalNotes)

  const editNotes = useEditCampOfferNotes()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label
        htmlFor='offerNotes'
        className='mx-auto inline p-2 text-center text-xl font-bold'
      >
        Editing Offer Notes
      </label>
      <form
        className='flex items-center justify-center'
        onSubmit={(e) => {
          e.preventDefault()
          editNotes.mutate({
            notes: notes,
            campOfferId: campOfferId,
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
