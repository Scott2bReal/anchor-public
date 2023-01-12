import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { cssClassTypeCodes } from "../utils/cssClassTypeCodes";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type ClassEditDayProps = {
  classId: string;
  classType: string;
  originalDay: string;
  onRequestClose: () => void;
}

export const ClassEditDay = ({ classId, classType, originalDay, onRequestClose }: ClassEditDayProps) => {
  const [newDay, setNewDay] = useState(originalDay)
  const ctx = trpc.useContext()
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

  const editDay = trpc.climbingClass.updateDay.useMutation({
    onMutate: async () => {
      ctx.gyms.getForClassInfo.cancel();
      ctx.gyms.getById.cancel();
    },
    onSettled: () => {
      ctx.gyms.getForClassInfo.invalidate();
      ctx.gyms.getById.invalidate();
    },
    onSuccess: () => {
      toast.success(`Class switched to ${newDay}`)
      onRequestClose()
    },
    onError: (e) => {
      toast.error(`Error changing class day: ${e.message}`)
    }
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
        className='relative flex gap-2 items-center justify-start'
        ref={formRef}
      >
        <Listbox
          value={newDay}
          onChange={setNewDay}
        >
          <Listbox.Button
            className='px-2 rounded-lg bg-neutral-100 text-slate-900 inline shadow-md shadow-neutral-900'
          >
            {newDay}
            <ChevronUpDownIcon className="h-4 w-4 inline" />
          </Listbox.Button>
          <Listbox.Options
            className='absolute top-9 rounded-lg bg-neutral-100 text-slate-900 z-[4] shadow-md shadow-neutral-900'
          >
            {classDays.map((day) => {
              return (
                <Listbox.Option
                  key={day}
                  value={day}
                  className={({ active }) => `${active ? `${classCode} text-neutral-100` : 'bg-neutral-100'} hover:cursor-pointer p-1 rounded-lg`}
                >{day}</Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Listbox>
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
