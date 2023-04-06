import { Switch } from '@headlessui/react'
import type { CampWeek, Gym } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import useFindClimber from '../hooks/useFindClimber'
import useLogger from '../hooks/useLogger'
import { api } from '../utils/api'
import { formatCampWeekDates } from '../utils/formatCampWeekDates'
import { CloseThisWindowButton } from './ClassInfo'
import { GymSelector } from './GymSelector'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  climberId: string
  gym: Gym
  weeks: CampWeek[]
  year: number
  onRequestClose: () => void
}
export const CampWaitlistForm = ({
  climberId,
  gym,
  weeks,
  year,
  onRequestClose,
}: Props) => {
  const { isLoading: climberLoading, data: selectedClimber } =
    useFindClimber(climberId)
  const { isLoading: gymsLoading, data: gyms } = api.gym.getForGymNav.useQuery()

  const { data: session } = useSession()
  const user = session?.user
  const ctx = api.useContext()
  const logger = useLogger()

  // Create an object we can use to manage setting avail state
  const avails = weeks.reduce((acc: { [key: string]: boolean }, week) => {
    const key = String(week.id)
    acc[key] = false
    return acc
  }, {})

  const [priorityEnabled, setPriorityEnabled] = useState(false)
  const [availStates, setAvailStates] = useState<{ [key: string]: boolean }>(
    avails
  )
  const [notes, setNotes] = useState('')
  const [clicked, setClicked] = useState(false)

  // Handler for when the user is setting waitlist availability
  const handleSetAvails = (key: string) => {
    const updatedAvails = { ...availStates }
    updatedAvails[key] = !updatedAvails[key]
    setAvailStates(updatedAvails)
  }

  const addToWaitlist = api.campWaitlist.add.useMutation({
    onMutate: async () => {
      toast.loading('Adding to waitlist...')
      await ctx.campWaitlist.getByGymAndYear.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.campWaitlist.getByGymAndYear.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(
        `Added ${selectedClimber ? selectedClimber.name : 'climber'} to the ${
          gym.name
        } camp waitlist`
      )
      onRequestClose()
      logger.mutate({
        climberId: climberId,
        message: `${
          user?.name ? user.name : 'Someone'
        } - Added to the ${year} ${gym.name} camp waitlist`,
      })
    },
  })

  if (climberLoading || gymsLoading) return <LoadingSpinner />
  if (!selectedClimber || !gyms) return <></>

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
            climberId: selectedClimber.id,
            gymId: gym.id,
            year: year,
            availability: Object.keys(availStates).filter(
              (key) => availStates[key]
            ),
            notes: notes,
          })

          setPriorityEnabled(false)
          setNotes('')
        }}
      >
        {/* Auto-selected info */}
        <div className='mx-auto max-w-fit p-2 text-start'>
          <GymSelector gyms={gyms} selectedGym={gym} />
        </div>

        {/* Set Priority */}
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

        {/* Set Availability */}
        <div className='flex flex-col items-center justify-center gap-2'>
          <div className='flex items-center justify-center gap-2'>
            <h2 className='text-lg font-bold'>Availability</h2>
          </div>
          <div className='flex items-center justify-center gap-2'>
            {weeks.map((week) => {
              const key = String(week.id)
              return (
                <Switch
                  key={key}
                  checked={availStates[key]}
                  onChange={() => handleSetAvails(key)}
                  className={`p-2 transition duration-150 ease-in-out hover:scale-95 ${gym.cssCode} rounded-lg shadow-md shadow-neutral-900 ui-not-checked:bg-gray-800`}
                >
                  <h3 className='font-bold'>Week {week.weekNumber}</h3>
                  <p>{formatCampWeekDates(week)}</p>
                </Switch>
              )
            })}
          </div>
        </div>

        {/* Set Notes */}
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

        {/* Submit or Close */}
        <div className='mb-1 flex flex-col gap-2'>
          <button
            type='submit'
            className={`${clicked ? 'scale-95' : ''} ${
              gym.cssCode
            } mx-auto mt-4 mb-1 rounded-lg bg-gray-800 p-1 text-neutral-100 shadow-md shadow-neutral-900`}
            onMouseDown={() => setClicked(true)}
            onMouseUp={() => setClicked(false)}
          >
            Add to Wait List
          </button>
          <CloseThisWindowButton closeFunction={onRequestClose} />
        </div>
      </form>
    </div>
  )
}
