import { Switch } from '@headlessui/react'
import { SetStateAction } from 'jotai'
import { useSession } from 'next-auth/react'
import { Dispatch, useState } from 'react'
import toast from 'react-hot-toast'
import useFindClimber from '../hooks/useFindClimber'
import useLogger from '../hooks/useLogger'
import { cssClassTypeCodes } from '../utils/cssClassTypeCodes'
import { trpc } from '../utils/trpc'
import { ClassTypeSelector } from './ClassTypeSelector'
import { GymSelector } from './GymSelector'
import LoadingSpinner from './LoadingSpinner'

type WaitlistFormProps = {
  climberId: string;
  gymId: string;
  classType: string;
  closeOnRequest: () => void;
}

const WaitlistForm = ({
  climberId,
  gymId,
  closeOnRequest,
  classType,
}: WaitlistFormProps) => {
  const { isLoading: climberLoading, data: selectedClimber } = useFindClimber(climberId)
  const { isLoading: gymLoading, data: selectedGym } =
    trpc.gyms.getForClassInfo.useQuery({ id: gymId })
  const { isLoading: gymsLoading, data: gyms } = trpc.gyms.getForGymNav.useQuery()
  const { data: session } = useSession()
  const user = session?.user

  const logger = useLogger()
  const [priorityEnabled, setPriorityEnabled] = useState(false)
  const [notes, setNotes] = useState('')

  const [monday, setMonday] = useState(false)
  const [tuesday, setTuesday] = useState(false)
  const [wednesday, setWednesday] = useState(false)
  const [thursday, setThursday] = useState(false)
  const [friday, setFriday] = useState(false)
  const [saturday, setSaturday] = useState(false)
  const [sunday, setSunday] = useState(false)

  const days: { [idx: string]: { state: boolean, setter: Dispatch<SetStateAction<boolean>> } } = {
    Monday: { state: monday, setter: setMonday },
    Tuesday: { state: tuesday, setter: setTuesday },
    Wednesday: { state: wednesday, setter: setWednesday },
    Thursday: { state: thursday, setter: setThursday },
    Friday: { state: friday, setter: setFriday },
    Saturday: { state: saturday, setter: setSaturday },
    Sunday: { state: sunday, setter: setSunday },
  }

  const cssCode = cssClassTypeCodes[classType]

  const ctx = trpc.useContext()

  const addToWaitlist = trpc.waitlist.putClimberOnWaitlist.useMutation({
    onMutate: async () => {
      toast.loading('Adding to waitlist...')
      await ctx.waitlist.getEntriesForGym.cancel()
    },
    onSettled: () => {
      ctx.waitlist.getEntriesForGym.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: ({ classType }) => {
      toast.dismiss()
      toast.success(`Added ${selectedClimber ? selectedClimber.name : 'climber'} to the  ${classType} waitlist`)
      closeOnRequest()
      logger.mutate({
        climberId: climberId,
        message: `${user?.name} - Added to the ${selectedGym?.name} ${classType} waitlist`
      })
    }
  })

  if (climberLoading || gymLoading || gymsLoading) {
    return <div className='flex flex-col gap-4'>
      <LoadingSpinner />
    </div>
  }

  if (!selectedClimber || !selectedGym || !gyms) return <></>

  return (
    <div className='max-h-[95vh] text-center overflow-scroll'>
      <h2 className='text-xl font-bold'>
        Add {selectedClimber.name} to the Waitlist
      </h2>
      <form
        className='text-center'
        onSubmit={(e) => {
          e.preventDefault()
          addToWaitlist.mutate({
            climberId: climberId,
            gymId: gymId,
            notes: notes,
            priority: priorityEnabled,
            classType: classType,
            mon: monday,
            tues: tuesday,
            weds: wednesday,
            thurs: thursday,
            fri: friday,
            sat: saturday,
            sun: sunday,
          })

          setPriorityEnabled(false)
          setNotes('')
        }}
      >
        {/* Auto-selected info */}
        <div className='max-w-fit mx-auto p-2 text-start'>
          <GymSelector gyms={gyms} selectedGym={selectedGym} />
          <ClassTypeSelector />
        </div>

        <div className='flex items-center justify-center'>
          <Switch.Group>
            <Switch.Label passive className='p-2 text-lg font-bold'>
              Priority
            </Switch.Label>
            <Switch
              checked={priorityEnabled}
              onChange={setPriorityEnabled}
              name='priority'
              className='relative inline-flex h-6 w-11 items-center rounded-full
          ui-checked:bg-sky-800 ui-not-checked:bg-neutral-300'
            >
              <span className='sr-only'>Priority</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${priorityEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              ></span>
            </Switch>
          </Switch.Group>
        </div>

        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='flex gap-2 items-center justify-center'>
            <h2 className='text-lg font-bold'>Availability</h2>
          </div>
          <div className='flex gap-2 items-center justify-center'>
            {
              Object.keys(days).map((day) => {
                return <Switch
                  key={day}
                  checked={days[day]?.state}
                  onChange={days[day]?.setter}
                  className={`hover:scale-95 transition duration-150 ease-in-out p-2 ${cssCode} ui-not-checked:bg-gray-800 rounded-lg shadow-neutral-900 shadow-md`}
                >
                  {day}
                </Switch>
              })
            }
          </div>
        </div>

        <div className='flex flex-col justify-center items-center p-2'>
          <label className='block text-lg font-bold' htmlFor='notes'>
            Notes
          </label>
          <textarea
            name='notes'
            className='bg-neutral-100 text-slate-900 rounded-lg p-2 w-full shadow-md shadow-neutral-900'
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          type='submit'
          className='mx-auto mt-4 block rounded-lg bg-gray-800 p-1 text-neutral-100 hover:scale-95 shadow-md shadow-neutral-900'
        >
          Add to Wait List
        </button>
      </form>
      <button
        className='mx-auto m-2 block rounded-lg bg-gray-800 p-1 text-neutral-100 hover:scale-95 shadow-md shadow-neutral-900'
        onClick={() => closeOnRequest()}
      >
        Close this window
      </button>
    </div>
  )
}

export default WaitlistForm
