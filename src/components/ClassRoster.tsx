import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import type { Climber, ClimbingClass } from '@prisma/client'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useUnenrollClimber } from '../hooks/climber/useUnenrollClimber'
import { useGetCurrentSession } from '../hooks/climbing-session/useGetCurrentSession'
import { useGetSessionById } from '../hooks/climbing-session/useGetSessionById'
import useLogger from '../hooks/useLogger'
import { climberAtom } from '../utils/atoms/climberAtom'
import grabClimber from '../utils/grabClimber'
import EmailsButton from './EmailsButton'
import LoadingSpinner from './LoadingSpinner'

interface SessionReminderProps {
  classSessionId: string
}

const SessionReminder = ({ classSessionId }: SessionReminderProps) => {
  const { data: currentSession, isLoading: currentLoading } =
    useGetCurrentSession()
  const { data: classSession, isLoading: classSessionLoading } =
    useGetSessionById(classSessionId)
  if (currentLoading || classSessionLoading) return <LoadingSpinner />
  if (!currentSession || !classSession)
    return <div>Error finding session data</div>
  return classSessionId === currentSession.id ? (
    <>
      <h3 className='font-bold text-red-600'>
        This class is in the current session ({currentSession.name}{' '}
        {currentSession.year}).{' '}
      </h3>
      <h4 className='font-bold text-red-600'>
        Please unenroll from the upcoming session instead
      </h4>
    </>
  ) : (
    <h3>
      This will unenroll this climber from the{' '}
      <span className='font-bold'>
        {classSession.name} {classSession.year}
      </span>{' '}
      session
    </h3>
  )
}

interface ClassRosterProps {
  climbingClass: ClimbingClass & { climbers: Climber[] }
}

const ClassRoster = ({ climbingClass }: ClassRosterProps) => {
  const { data: session } = useSession()
  const user = session?.user
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [unenrollingClimber, setUnenrollingClimber] = useState<Climber | null>(
    null
  )
  const unEnrollClimber = useUnenrollClimber()
  const logger = useLogger()
  const [parent] = useAutoAnimate<HTMLDivElement>()

  if (!session || !user) return <div>Log in!</div>

  const climbers = climbingClass.climbers

  return (
    <>
      <div className='flex flex-col gap-2 p-4'>
        <h1 className='flex items-center justify-center gap-2 text-xl font-bold'>
          <span>Class Roster</span>
          <EmailsButton climbers={climbingClass.climbers} />
        </h1>
        <ul>
          <div ref={parent} className='flex flex-col items-start justify-start'>
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
            <SessionReminder classSessionId={climbingClass.sessionId} />

            <form
              onSubmit={(e) => {
                if (!unenrollingClimber) return

                e.preventDefault()
                unEnrollClimber.mutate({
                  classId: climbingClass.id,
                  id: unenrollingClimber.id,
                })
                logger.mutate({
                  climberId: unenrollingClimber.id,
                  message: `${
                    user.name ? user.name : 'Someone'
                  } - Unenrolled from a ${climbingClass.className} class`,
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

export default ClassRoster
