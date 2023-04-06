import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useGetClimberById } from '../hooks/climber/useGetClimberById'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { climberAtom } from '../utils/atoms/climberAtom'
import { CampClimberDetails } from './CampClimberDetails'
import ClimberDetails from './ClimberDetails'
import LoadingSpinner from './LoadingSpinner'
import { ClimberNotesButton } from './ClimberNotesButton'

const ClimberInfo = () => {
  const [selectedClimberId] = useAtom(climberAtom)
  const { data: user, isLoading: userLoading } = useCurrentUser()

  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  const { isLoading, data: climber } = useGetClimberById({ selectedClimberId })

  if (isLoading || userLoading) {
    if (!selectedClimberId) {
      return <div>No climber selected</div>
    }
    return <LoadingSpinner />
  }
  if (!user) return <div>Please sign in</div>
  if (!climber || !selectedClimberId) return <h2>No climber selected</h2>

  return (
    <>
      <div className='max-w-full overflow-x-scroll p-4 '>
        <h2 className='text-xl font-extrabold text-neutral-300'>
          Climber Info
        </h2>

        <ul className='list-disc'>
          <li>{climber.name}</li>
          <li>{climber.parentEmail}</li>
        </ul>

        <div className='mt-4 flex flex-col gap-4'>
          <button
            className='pointer-events-auto rounded-lg bg-gray-500 p-1 text-slate-900 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
            onClick={() => toggleOpen()}
          >
            View Details
          </button>
        </div>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
          <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
          <div className='fixed inset-0 z-[4] flex max-h-[95vh] p-4'>
            <Dialog.Panel className='z-[4] m-auto h-fit max-h-[95vh] max-w-full overflow-scroll rounded-lg bg-neutral-800 p-6'>
              {user.showCamp ? (
                <CampClimberDetails climberId={climber.id} />
              ) : (
                <ClimberDetails climber={climber} />
              )}

              <button
                className='mx-auto block w-fit rounded-lg bg-gray-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
                onClick={() => toggleOpen()}
              >
                Close this window
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </>
  )
}

export default ClimberInfo
