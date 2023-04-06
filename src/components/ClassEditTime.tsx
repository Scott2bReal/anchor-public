import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useUpdateClassTime } from '../hooks/climbing-class/useUpdateClassTime'
import { parseTimeInput } from '../utils/parseTimeInput'
import setDuration from '../utils/setDuration'
import { InlineEditButtons } from './InlineEditButtons'

type ClassEditTimeProps = {
  classId: string
  classType: string
  originalTime: Date
  timeZone: string
  onRequestClose: () => void
}

export const ClassEditTime = ({
  classId,
  classType,
  originalTime,
  onRequestClose,
  timeZone,
}: ClassEditTimeProps) => {
  const [newTime, setNewTime] = useState(originalTime.toLocaleTimeString())

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const editTime = useUpdateClassTime(onRequestClose)

  return (
    <>
      <h1 className='font-bold'>Edit Class Start Time</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editTime.mutate({
            classId: classId,
            startTime: parseTimeInput(newTime, timeZone),
            endTime: setDuration({
              classType: classType,
              startTime: parseTimeInput(newTime, timeZone),
            }),
          })
        }}
        className='flex items-center justify-start gap-2'
        ref={formRef}
      >
        <input
          onChange={(e) => {
            setNewTime(e.target.value)
          }}
          type='time'
          autoFocus
          className='rounded-lg px-2 text-slate-900 shadow-md shadow-neutral-900'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
