import { Listbox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useUpdateClassDay } from '../hooks/climbing-class/useUpdateClassDay'
import { cssClassTypeCodes } from '../utils/cssClassTypeCodes'
import { InlineEditButtons } from './InlineEditButtons'

type ClassEditDayProps = {
  classId: string
  classType: string
  originalDay: string
  onRequestClose: () => void
}

export const ClassEditDay = ({
  classId,
  classType,
  originalDay,
  onRequestClose,
}: ClassEditDayProps) => {
  const [newDay, setNewDay] = useState(originalDay)
  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const classDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  const classCode = cssClassTypeCodes[classType]

  const editDay = useUpdateClassDay({
    onRequestClose: onRequestClose,
    newDay: newDay,
  })

  return (
    <>
      <h1 className='font-bold'>Edit Class Day</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editDay.mutate({
            classId: classId,
            newDay: newDay,
          })
        }}
        className='relative flex items-center justify-start gap-2'
        ref={formRef}
      >
        <Listbox value={newDay} onChange={setNewDay}>
          <Listbox.Button className='inline rounded-lg bg-neutral-100 px-2 text-slate-900 shadow-md shadow-neutral-900'>
            {newDay}
            <ChevronUpDownIcon className='inline h-4 w-4' />
          </Listbox.Button>
          <Listbox.Options className='absolute top-9 z-[4] rounded-lg bg-neutral-100 text-slate-900 shadow-md shadow-neutral-900'>
            {classDays.map((day) => {
              return (
                <Listbox.Option
                  key={day}
                  value={day}
                  className={({ active }) =>
                    `${
                      active
                        ? `${classCode ?? ''} text-neutral-100`
                        : 'bg-neutral-100'
                    } rounded-lg p-1 hover:cursor-pointer`
                  }
                >
                  {day}
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Listbox>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
