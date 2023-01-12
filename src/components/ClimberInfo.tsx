import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { climberAtom } from '../utils/atoms/climberAtom'
import { gymAtom } from '../utils/atoms/gymAtom'
import { trpc } from '../utils/trpc'
import ClimberDetails from './ClimberDetails'
import ContextButton from './ContextButton'
import LoadingSpinner from './LoadingSpinner'


const ClimberInfo = () => {
  const [selectedClimberId] = useAtom(climberAtom)
  const [selectedGymId] = useAtom(gymAtom)
  const info = useRouter().pathname

  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  const { isLoading, data: climber } = trpc.climber.getById.useQuery({
    id: selectedClimberId,
  })

  if (isLoading) return <LoadingSpinner />
  if (!climber || !selectedClimberId) return <h2>No climber selected</h2>

  return isLoading ? (
    <div className='p-4'>Fetching climber info...</div>
  ) : (
      <>
        <div className='p-4 overflow-x-scroll max-w-full '>
          <h2 className='text-xl text-neutral-300 font-extrabold'>Climber Info</h2>

          <ul className='list-disc'>
            <li>{climber.name}</li>
            <li>{climber.parentEmail}</li>
          </ul>

          <div className='flex flex-col gap-4 mt-4'>
            <button
              className='shadow-md shadow-neutral-900 pointer-events-auto rounded-lg bg-gray-500 p-1 text-slate-900 hover:scale-95 transition duration-150 ease-in-out'
              onClick={() => toggleOpen()}
            >
              View Details
            </button>
          </div>
          <Dialog
            open={isOpen} onClose={() => setIsOpen(false)}
          >
            <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
            <div
              className='z-[4] fixed inset-0 flex p-4 max-h-[95vh]'
            >
              <Dialog.Panel
                className='z-[4] m-auto rounded-lg bg-neutral-800 p-6 h-fit max-h-[95vh] max-w-full overflow-scroll'
              >
                <ClimberDetails climber={climber} />
                <button
                  className='mx-auto block w-fit shadow-md shadow-neutral-900 p-2 rounded-lg bg-gray-800 hover:scale-95 transition duration-150 ease-in-out'
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
