import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useCampWeekEditDates } from '../hooks/camp/useCampWeekEditDates'
import { InlineEditButtons } from './InlineEditButtons'

type Props = {
  weekId: string
  originalStartDate: Date
  originalEndDate: Date
  onRequestClose: () => void
}

export const CampWeekEditDates = ({
  weekId,
  originalStartDate,
  originalEndDate,
  onRequestClose,
}: Props) => {
  const [startDate, setStartDate] = useState(originalStartDate)
  const [endDate, setEndDate] = useState(originalEndDate)

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const editWeek = useCampWeekEditDates(onRequestClose)

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editWeek.mutate({
            weekId: weekId,
            newStartDate: startDate,
            newEndDate: endDate,
          })
        }}
        className='flex items-center justify-start gap-2'
        ref={formRef}
      >
        <input
          onChange={(e) => {
            setStartDate(new Date(e.target.value))
          }}
          type='date'
          value={startDate.toISOString().substring(0, 10)}
          autoFocus
          className='rounded-lg px-2 text-slate-900 shadow-md shadow-neutral-900'
        />
        <input
          onChange={(e) => {
            setEndDate(new Date(e.target.value))
          }}
          type='date'
          value={endDate.toISOString().substring(0, 10)}
          className='rounded-lg px-2 text-slate-900 shadow-md shadow-neutral-900'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
