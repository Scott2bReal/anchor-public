import { Dialog, Switch } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import type { CampWaitlistEntry, CampWeek, Climber, Gym } from '@prisma/client'
import { useState } from 'react'
import { useUpdateCampPriority } from '../hooks/waitlist-hooks/useUpdateCampPriority'
import { useUpdateCampWaitlistAvails } from '../hooks/waitlist-hooks/useUpdateCampWaitlistAvails'
import { formatCampWeekDates } from '../utils/formatCampWeekDates'
import { CampWaitlistEditDate } from './CampWaitlistEditDate'
import { CampWaitlistEditNotes } from './CampWaitlistEditNotes'
import { InlineEditPencilButton } from './InlineEditPencilButton'
import SelectClimberButton from './SelectClimberButton'

type Props = {
  entry: CampWaitlistEntry & { climber: Climber; gym: Gym }
  weeks: CampWeek[]
}

export const CampWaitlistDetails = ({ entry, weeks }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [availsOpen, setAvailsOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [addedOpen, setAddedOpen] = useState(false)

  const [priority, setPriority] = useState(entry.priority)

  const updatePriority = useUpdateCampPriority()
  const updateAvails = useUpdateCampWaitlistAvails(entry.climber)

  const togglePriority = () => {
    updatePriority.mutate({
      entryId: entry.id,
      priority: !priority,
    })
    setPriority(!priority)
  }

  // Create an object we can use to manage setting avail state
  const avails = weeks.reduce((acc: { [key: string]: boolean }, week) => {
    const key = String(week.id)
    const available = entry.availability.includes(key)
    acc[key] = available
    return acc
  }, {})

  // Manage state for avails
  const [availStates, setAvailStates] = useState<{ [key: string]: boolean }>(
    avails
  )

  // Handler for when the user is setting waitlist availability
  const handleSetAvails = (key: string) => {
    const updatedAvails = { ...availStates }
    updatedAvails[key] = !updatedAvails[key]
    setAvailStates(updatedAvails)
  }

  const filteredWeeks = weeks.filter((week) =>
    entry.availability.includes(week.id)
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`mx-auto block rounded-lg p-2 shadow-md shadow-neutral-900 ${entry.gym.cssCode} transition duration-150 ease-in-out hover:scale-105`}
      >
        View Entry
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-2 rounded-lg bg-neutral-800 p-6 shadow-md shadow-neutral-900'>
            <div className='flex w-full flex-col items-center justify-evenly gap-2'>
              <h1 className='text-2xl font-bold'>
                Waitlist Details for {entry.climber.name}
              </h1>
              <h2 className={`${entry.gym.cssCode}-text text-2xl font-bold`}>
                {entry.gym.name}
              </h2>

              <div className='w-full text-center align-middle'>
                {addedOpen ? (
                  <CampWaitlistEditDate
                    entryId={entry.id}
                    originalDate={entry.createdAt}
                    onRequestClose={() => setAddedOpen(false)}
                  />
                ) : (
                  <div className='align-middle'>
                    <span className='py-2 text-xl font-bold'>Added:</span>
                    <span className='p-2'>
                      {entry.createdAt.toLocaleDateString()}
                    </span>
                    <InlineEditPencilButton
                      openFunction={() => setAddedOpen(true)}
                    />
                  </div>
                )}
              </div>

              <h2 className='flex items-center justify-center gap-2 text-xl font-bold'>
                Availability
                <button
                  className='transition duration-150 ease-in-out hover:opacity-75'
                  onClick={() => setAvailsOpen(true)}
                >
                  <PencilSquareIcon className='h-4 w-4' />
                </button>
              </h2>
              <ul>
                {filteredWeeks.map((week) => {
                  return (
                    <li className='font-bold' key={week.id}>
                      <span className={`${entry.gym.cssCode}-text`}>
                        Week {week.weekNumber}:
                      </span>{' '}
                      {formatCampWeekDates(week)}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div>
              <Switch.Group>
                <Switch.Label passive className={`p-4 text-lg font-bold`}>
                  Priority
                </Switch.Label>
                <Switch
                  as='button'
                  checked={priority}
                  onChange={togglePriority}
                  name='priority'
                  className='relative inline-flex h-6 w-11 items-center rounded-full
              ui-checked:bg-sky-800 ui-not-checked:bg-neutral-300'
                >
                  <span className='sr-only'>Priority</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                      priority ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></span>
                </Switch>
              </Switch.Group>
            </div>
            <div className='w-full text-center'>
              {notesOpen ? (
                <CampWaitlistEditNotes
                  entryId={entry.id}
                  originalNotes={entry.notes}
                  onRequestClose={() => setNotesOpen(false)}
                />
              ) : (
                <>
                  <h2 className='mx-auto inline p-2 text-center text-xl font-bold'>
                    Entry Notes
                  </h2>
                  <InlineEditPencilButton
                    openFunction={() => setNotesOpen(true)}
                  />
                  <p>{entry.notes}</p>
                </>
              )}
            </div>
            <SelectClimberButton climber={entry.climber} />
            <button
              className='mx-auto block w-fit rounded-lg bg-gray-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
              onClick={() => setIsOpen(false)}
            >
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={availsOpen} onClose={() => setAvailsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <form
          className='fixed inset-0 z-[5] flex items-center justify-center p-4'
          onSubmit={(e) => {
            e.preventDefault()
            updateAvails.mutate({
              entryId: entry.id,
              availability: Object.keys(availStates).filter(
                (key) => availStates[key]
              ),
            })
            setAvailsOpen(false)
          }}
        >
          <Dialog.Panel className='z-[6] mx-auto flex flex-col items-center justify-center gap-6 rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-900'>
            {/* Set Availability */}
            <div className='flex flex-col items-center justify-center gap-2'>
              <div className='flex items-center justify-center gap-2'>
                <h2 className='text-lg font-bold'>
                  Setting {entry.year} Camp Availability for{' '}
                  {entry.climber.name}
                </h2>
              </div>
              <div className='flex items-center justify-center gap-2'>
                {weeks.map((week) => {
                  const key = String(week.id)
                  return (
                    <Switch
                      key={key}
                      checked={availStates[key]}
                      onChange={() => handleSetAvails(key)}
                      className={`p-2 transition duration-150 ease-in-out hover:scale-95 ${entry.gym.cssCode} rounded-lg shadow-md shadow-neutral-900 ui-not-checked:bg-gray-800`}
                    >
                      <h3 className='font-bold'>Week {week.weekNumber}</h3>
                      <p>{formatCampWeekDates(week)}</p>
                    </Switch>
                  )
                })}
              </div>
            </div>

            <div className='flex w-full items-center justify-center gap-2'>
              <button
                type='submit'
                className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
              >
                Save
              </button>
              <button
                className='flex-1 rounded-lg bg-red-600 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
                onClick={() => setAvailsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </form>
      </Dialog>
    </>
  )
}
