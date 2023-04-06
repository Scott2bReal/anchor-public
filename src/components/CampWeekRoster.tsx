import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import type { CampWeek, Climber } from '@prisma/client'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useCampUnenrollClimber } from '../hooks/climber/useCampUnenrollClimber'
import useLogger from '../hooks/useLogger'
import { climberAtom } from '../utils/atoms/climberAtom'
import grabClimber from '../utils/grabClimber'
import EmailsButton from './EmailsButton'

interface Props {
  campWeek: CampWeek & { climbers: Climber[] }
}

export const CampWeekRoster = ({ campWeek }: Props) => {
  const { data: session } = useSession()
  const user = session?.user
  const logger = useLogger()
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [unenrollingClimber, setUnenrollingClimber] = useState<Climber | null>(
    null
  )
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const unEnrollClimber = useCampUnenrollClimber()

  if (!session || !user) return <div>Log in!</div>

  const climbers = campWeek.climbers

  return (
    <>
      <div className='flex flex-col flex-wrap gap-2 p-4'>
        <h1 className='flex items-center justify-center gap-2 text-xl font-bold'>
          <span>Camp Week Roster</span>
          <EmailsButton climbers={campWeek.climbers} />
        </h1>
        <ul>
          <div className='flex flex-col items-start justify-start' ref={parent}>
            {climbers.length === 0 ? (
              <li className='text-red-500'>No climbers enrolled</li>
            ) : (
              climbers?.map((climber) => {
                return (
                  <li key={climber.id}>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        className=''
                        onClick={() => {
                          setUnenrollingClimber(climber)
                          setConfirmOpen(true)
                        }}
                      >
                        <XMarkIcon className='h-4 w-4 text-red-500 transition duration-150 ease-in-out hover:scale-75' />
                      </button>
                      <span
                        className='hover:cursor-pointer'
                        onClick={() =>
                          grabClimber(climber, () =>
                            setSelectedClimberId(climber.id)
                          )
                        }
                      >
                        {climber.name}
                      </span>
                    </div>
                  </li>
                )
              })
            )}
          </div>
        </ul>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex max-h-[100vh] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex max-h-screen flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6'>
            <h1 className='text-2xl font-extrabold '>
              Unenrolling {unenrollingClimber?.name}
            </h1>
            <form
              onSubmit={(e) => {
                if (!unenrollingClimber) return

                e.preventDefault()
                unEnrollClimber.mutate({
                  weekId: campWeek.id,
                  id: unenrollingClimber.id,
                })
                logger.mutate({
                  climberId: unenrollingClimber.id,
                  message: `${
                    user.name ? user.name : 'Someone'
                  } - Unenrolled from camp week ${campWeek.weekNumber} ${
                    campWeek.year
                  }`,
                })

                setConfirmOpen(false)
                setUnenrollingClimber(null)
              }}
            >
              <div className='flex items-center justify-center gap-2 pt-4'>
                <button
                  type='submit'
                  className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-neutral-900 transition-transform duration-150 ease-in-out hover:scale-95'
                >
                  Confirm
                </button>
                <button
                  className='flex-1 rounded-lg bg-red-700 p-2 shadow-md shadow-neutral-900 transition-transform duration-150 ease-in-out hover:scale-95'
                  onClick={() => {
                    setConfirmOpen(false)
                    setUnenrollingClimber(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
