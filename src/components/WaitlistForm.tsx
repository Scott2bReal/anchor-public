import { Switch } from '@headlessui/react'
import type { SetStateAction } from 'jotai'
import { useSession } from 'next-auth/react'
import type { Dispatch } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useGetGymForClassInfo } from '../hooks/gym/useGetGymForClassInfo'
import { useGetGymsForGymNav } from '../hooks/gym/useGetGymsForGymNav'
import useFindClimber from '../hooks/useFindClimber'
import useLogger from '../hooks/useLogger'
import { api } from '../utils/api'
import { cssClassTypeCodes } from '../utils/cssClassTypeCodes'
import { ClassTypeSelector } from './ClassTypeSelector'
import { GymSelector } from './GymSelector'
import LoadingSpinner from './LoadingSpinner'

type WaitlistFormProps = {
  climberId: string
  gymId: string
  classType: string
  closeOnRequest: () => void
}

const WaitlistForm = ({
  climberId,
  gymId,
  closeOnRequest,
  classType,
}: WaitlistFormProps) => {
  const { isLoading: climberLoading, data: selectedClimber } =
    useFindClimber(climberId)
  const { isLoading: gymLoading, data: selectedGym } =
    useGetGymForClassInfo(gymId)
  const { isLoading: gymsLoading, data: gyms } = useGetGymsForGymNav()
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

  const days: {
    [idx: string]: { state: boolean; setter: Dispatch<SetStateAction<boolean>> }
  } = {
    Monday: { state: monday, setter: setMonday },
    Tuesday: { state: tuesday, setter: setTuesday },
    Wednesday: { state: wednesday, setter: setWednesday },
    Thursday: { state: thursday, setter: setThursday },
    Friday: { state: friday, setter: setFriday },
    Saturday: { state: saturday, setter: setSaturday },
    Sunday: { state: sunday, setter: setSunday },
  }

  const cssCode = cssClassTypeCodes[classType]

  const ctx = api.useContext()

  const addToWaitlist = api.waitlist.putClimberOnWaitlist.useMutation({
    onMutate: async () => {
      toast.loading('Adding to waitlist...')
      await ctx.waitlist.getEntriesForGym.cancel()
    },
    onSettled: async () => {
      await ctx.waitlist.getEntriesForGym.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: ({ classType }) => {
      toast.dismiss()
      toast.success(
        `Added ${
          selectedClimber ? selectedClimber.name : 'climber'
        } to the  ${classType} waitlist`
      )
      closeOnRequest()
      logger.mutate({
        climberId: climberId,
        message: `${user?.name ?? 'Someone'} - Added to the ${
          selectedGym?.name ?? ''
        } ${classType} waitlist`,
      })
    },
  })

  if (climberLoading || gymLoading || gymsLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <LoadingSpinner />
      </div>
    )
  }

  if (!selectedClimber || !selectedGym || !gyms) return <></>

  return (
    <div className='max-h-[95vh] overflow-scroll text-center'>
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
        <div className='mx-auto max-w-fit p-2 text-start'>
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
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                  priorityEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </Switch>
          </Switch.Group>
        </div>

        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-lg font-bold'>Availability</h2>
          </div>
          <div className='flex items-center justify-center gap-2'>
            {Object.keys(days).map((day) => {
              return (
                <Switch
                  key={day}
                  checked={days[day]?.state}
                  onChange={days[day]?.setter}
                  className={`p-2 transition duration-150 ease-in-out hover:scale-95 ${
                    cssCode ?? ''
                  } rounded-lg shadow-md shadow-neutral-900 ui-not-checked:bg-gray-800`}
                >
                  {day}
                </Switch>
              )
            })}
          </div>
        </div>

        <div className='flex flex-col items-center justify-center p-2'>
          <label className='block text-lg font-bold' htmlFor='notes'>
            Notes
          </label>
          <textarea
            name='notes'
            className='w-full rounded-lg bg-neutral-100 p-2 text-slate-900 shadow-md shadow-neutral-900'
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          type='submit'
          className={`mx-auto mt-4 block rounded-lg ${
            cssCode ?? 'bg-gray-800'
          } p-1 text-neutral-100 shadow-md shadow-neutral-900 hover:scale-95`}
        >
          Add to Wait List
        </button>
      </form>
      <button
        className='m-2 mx-auto block rounded-lg bg-gray-800 p-1 text-neutral-100 shadow-md shadow-neutral-900 hover:scale-95'
        onClick={() => closeOnRequest()}
      >
        Close this window
      </button>
    </div>
  )
}

export default WaitlistForm
