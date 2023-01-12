import { Listbox, RadioGroup, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import Image from "next/image";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { sessionAtom } from "../utils/atoms/sessionAtom";
import { cssClassTypeCodes } from "../utils/cssClassTypeCodes";
import { parseTimeInput } from "../utils/parseTimeInput";
import setDuration from "../utils/setDuration";
import { CLASS_SLOTS } from "../utils/slotsPerClassType";
import { trpc } from "../utils/trpc";

type NewClassFormProps = {
  gymId: string;
  closeOnRequest: () => void;
}

const NewClassForm = ({ gymId, closeOnRequest }: NewClassFormProps) => {
  const [classType, setClassType] = useState('Stone Masters')
  const [day, setDay] = useState('Monday')
  const [instructor, setInstructor] = useState('')
  const [startTime, setStartTime] = useState('')
  const [selectedSession] = useAtom(sessionAtom)
  // const [slots, setSlots] = useState(4)
  const ctx = trpc.useContext()

  const addClimbingClass = trpc.climbingClass.create.useMutation({
    onMutate: async () => {
      toast.loading('Creating class...')
      await ctx.gyms.getById.cancel()
    },
    onSettled: () => {
      ctx.gyms.getById.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Added class to schedule!")

      closeOnRequest()
    }
  })

  const classTypes: string[] = [
    'Rock Warriors',
    'Stone Masters',
    'Teen Club',
    'Rock Hoppers',
    'Scramblers',
    'Spider Monkeys'
  ]

  const classDays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]

  return selectedSession ? (
    <form
      className='flex flex-col justify-center items-center gap-2 p-4 w-full'
      onSubmit={(e) => {
        e.preventDefault()
        addClimbingClass.mutate({
          className: classType,
          day: day,
          gymId: gymId,
          startTime: parseTimeInput(startTime),
          // TODO tighten up this typing. Same as below
          endTime: setDuration({ startTime: parseTimeInput(startTime), classType: classType }),
          instructor: instructor,
          // TODO tighten up this typing. For now it is OK since user never gets to type class name
          slots: CLASS_SLOTS[classType] as number,
          sessionId: selectedSession.id,
        })
        setClassType('')
        setDay('Monday')
        setInstructor('')
      }}

    >
      <RadioGroup
        value={classType}
        onChange={setClassType}
        name='classTypeSelection'
      >
        <RadioGroup.Label className='text-lg font-bold '>
          Select Class Type
        </RadioGroup.Label>
        <div className='space-y-2'>
          {classTypes.map((classType) => (
            <RadioGroup.Option
              key={classType}
              value={classType}
              className={({ active, checked }) =>
                `${active
                  ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                  : ''
                }
                  ${checked ? `${cssClassTypeCodes[classType]} bg-opacity-75 text-white ` : `${cssClassTypeCodes[classType]} text-white `
                }
                    relative flex cursor-pointer rounded-lg px-3 py-2 text-white shadow-md focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='text-sm'>
                        <RadioGroup.Label
                          as='p'
                          className={`font-medium  ${checked ? 'text-neutral-100' : 'opacity-75'}`}
                        >
                          {classType}
                        </RadioGroup.Label>
                      </div>
                    </div>
                    {checked && (
                      <div className='shrink-0 text-white'>
                        {/* <CheckIcon className="h-6 w-6" /> */}
                        <Image
                          src='/favicon.ico'
                          alt='carabiner'
                          height={28}
                          width={28}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <h2 className='text-lg font-bold'>Select Day</h2>
      <Listbox value={day} onChange={setDay}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white text-neutral-900 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm shadow-neutral-900">
            <span className="block truncate">{day}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {classDays.map((day, idx) => (
                <Listbox.Option
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={day}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {day}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      <label htmlFor='instructor'>Instructor</label>
      <input name='instructor' className='px-2 bg-neutral-100 text-neutral-900 rounded-lg shadow-md shadow-neutral-900' onChange={(e) => setInstructor(e.target.value)} />

      <label htmlFor="startTime">Start Time</label>
      <input className='text-neutral-900 px-2 shadow-md shadow-neutral-900 rounded-lg' name='startTime' type='time' onChange={(e) => setStartTime(e.target.value)} />

      <button type='submit' className='mt-2 p-2 rounded-lg bg-slate-700 hover:scale-105 transition ease-in-out shadow-md shadow-neutral-900'>Create Class</button>
    </form>
  ) : (
    <div>Please select a session</div>
  )
}

export default NewClassForm
