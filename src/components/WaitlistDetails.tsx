import { Dialog, Switch } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/solid'
import { Climber, Gym, WaitlistEntry } from '@prisma/client'
import { SetStateAction } from 'jotai'
import { Dispatch, useState } from 'react'
import useUpdateWaitlistAvails from '../hooks/waitlist-hooks/useUpdateWaitlistAvails'
import useUpdateWaitlistPriority from '../hooks/waitlist-hooks/useUpdateWaitlistPriority'
import { cssClassTypeCodes } from '../utils/cssClassTypeCodes'
import { InlineEditPencilButton } from './InlineEditPencilButton'
import SelectClimberButton from './SelectClimberButton'
import WaitlistEditDate from './WaitlistEditDate'
import WaitlistEditNotes from './WaitlistEditNotes'

type WaitlistDetailsProps = {
  entry: WaitlistEntry & { climber: Climber, gym: Gym, }
}

const WaitlistDetails = ({ entry }: WaitlistDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [availsOpen, setAvailsOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [addedOpen, setAddedOpen] = useState(false)

  const [monday, setMonday] = useState(entry.mon)
  const [tuesday, setTuesday] = useState(entry.tues)
  const [wednesday, setWednesday] = useState(entry.weds)
  const [thursday, setThursday] = useState(entry.thurs)
  const [friday, setFriday] = useState(entry.fri)
  const [saturday, setSaturday] = useState(entry.sat)
  const [sunday, setSunday] = useState(entry.sun)

  const [priority, setPriority] = useState(entry.priority)

  const days: { [idx: string]: { state: boolean, setter: Dispatch<SetStateAction<boolean>> } } = {
    Monday: { state: monday, setter: setMonday },
    Tuesday: { state: tuesday, setter: setTuesday },
    Wednesday: { state: wednesday, setter: setWednesday },
    Thursday: { state: thursday, setter: setThursday },
    Friday: { state: friday, setter: setFriday },
    Saturday: { state: saturday, setter: setSaturday },
    Sunday: { state: sunday, setter: setSunday },
  }

  const updatePriority = useUpdateWaitlistPriority()
  const updateAvails = useUpdateWaitlistAvails(entry.climberId)

  const availableDayNames = Object.keys(days).filter((day) => { return days[day]?.state })

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`shadow-neutral-900 shadow-md mx-auto block p-2 rounded-lg ${cssClassTypeCodes[entry.classType]} hover:scale-105 transition duration-150 ease-in-out`}
      >
        View Entry
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 flex flex-col justify-center items-center gap-2 shadow-md shadow-neutral-900'
          >
            <div className='flex flex-col gap-2 items-center justify-evenly w-full'>
              <h1 className='font-bold text-2xl'>Waitlist Details for {entry.climber.name}</h1>
              <h2 className={`${entry.gym?.cssCode}-text font-bold text-2xl`}>{entry.gym?.name}</h2>
              <h2 className={`${cssClassTypeCodes[entry.classType]}-text font-bold text-2xl`}>{entry.classType}</h2>

              <div className='w-full text-center align-middle'>
                {
                  addedOpen
                    ?
                    <WaitlistEditDate entryId={entry.id} originalDate={entry.createdAt} onRequestClose={() => setAddedOpen(false)} />
                    :
                    <div className='align-middle'>
                      <span className='text-xl font-bold py-2'>Added:</span><span className='p-2'>{entry.createdAt.toLocaleDateString()}</span>
                      <InlineEditPencilButton openFunction={() => setAddedOpen(true)} />
                    </div>
                }
              </div>

              <h2 className='font-bold text-xl flex gap-2 justify-center items-center'>
                Availability
                <button
                  className='transition duration-150 ease-in-out hover:opacity-75'
                  onClick={() => setAvailsOpen(true)}
                >
                  <PencilSquareIcon className='h-4 w-4' />
                </button>
              </h2>
              <p>{availableDayNames.join(', ')}</p>
            </div>
            <div>
              <Switch.Group>
                <Switch.Label passive className={`p-4 text-lg font-bold`}>
                  Priority
                </Switch.Label>
                <Switch
                  checked={priority}
                  onChange={setPriority}
                  onClick={() => updatePriority.mutate({ entryId: entry.id, priority: !priority })}
                  name='priority'
                  className='relative inline-flex h-6 w-11 items-center rounded-full
              ui-checked:bg-sky-800 ui-not-checked:bg-neutral-300'
                >
                  <span className='sr-only'>Priority</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${priority ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  ></span>
                </Switch>
              </Switch.Group>
            </div>
            <div className='w-full text-center'>
              {
                notesOpen
                  ?
                  <WaitlistEditNotes entryId={entry.id} originalNotes={entry.notes} onRequestClose={() => setNotesOpen(false)} />
                  :
                  <>
                    <h2 className='text-xl font-bold mx-auto text-center inline p-2'>Entry Notes</h2>
                    <InlineEditPencilButton openFunction={() => setNotesOpen(true)} />
                    <p>{entry.notes}</p>
                  </>
              }
            </div>
            <SelectClimberButton climber={entry.climber} />
            <button
              className='mx-auto block w-fit shadow-md shadow-neutral-900 p-2 rounded-lg bg-gray-800 hover:scale-95 transition duration-150 ease-in-out'
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
              mon: monday,
              tues: tuesday,
              weds: wednesday,
              thurs: thursday,
              fri: friday,
              sat: saturday,
              sun: sunday,
            })
            setAvailsOpen(false)
          }}
        >
          <Dialog.Panel className='z-[6] mx-auto rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-900 flex flex-col justify-center items-center gap-6'>
            <h1 className='text-2xl font-bold'>Editing waitlist availability for {entry.climber.name}</h1>
            <div className='flex items-center justify-center gap-2'>
              <Switch.Group>
                {Object.keys(days).map((day) => {
                  return (
                    <Switch
                      key={day}
                      checked={days[day]?.state}
                      onChange={days[day]?.setter}
                      className={`bg-gray-800 p-2 transition duration-150 ease-in-out ${cssClassTypeCodes[entry.classType]
                        } rounded-lg ui-not-checked:bg-gray-800 hover:scale-95`}
                    >
                      {day}
                    </Switch>
                  )
                })}
              </Switch.Group>
            </div>
            <div className='flex gap-2 w-full justify-center items-center'>
              <button
                type='submit'
                className='shadow-md shadow-black hover:scale-95 bg-green-600 p-2 rounded-lg flex-1 transition duration-150 ease-in-out'
              >
                Save
              </button>
              <button
                className='hover:scale-95 bg-red-600 p-2 rounded-lg flex-1 shadow-black shadow-md transition duration-150 ease-in-out'
                onClick={() => setAvailsOpen(false)}
              >Cancel</button>
            </div>
          </Dialog.Panel>
        </form>
      </Dialog>
    </>
  )
}

export default WaitlistDetails
