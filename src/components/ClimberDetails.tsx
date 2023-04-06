import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Dialog, Switch } from '@headlessui/react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import type {
  Climber,
  ClimberLog,
  ClimbingClass,
  ClimbingSession,
  Gym,
  Offer,
  WaitlistEntry,
} from '@prisma/client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import formatLocaleString from '../utils/formatLocaleString'
import ClassCard from './ClassCard'
import { ClimberDeleteButton } from './ClimberDeleteButton'
import { ClimberEditEmail } from './ClimberEditEmail'
import { ClimberEditName } from './ClimberEditName'
import EmailsButton from './EmailsButton'
import LoadingSpinner from './LoadingSpinner'
import OfferCard from './OfferCard'
import WaitlistDetails from './WaitlistDetails'
import { ClimberNotesButton } from './ClimberNotesButton'

type ClimberDetailClassesProps = {
  classes: (ClimbingClass & {
    climbers: Climber[]
    offers: Offer[]
  })[]
  currentSession: ClimbingSession
  upcomingSession: ClimbingSession
}

const ClimberDetailClasses = ({
  classes,
  currentSession,
  upcomingSession,
}: ClimberDetailClassesProps) => {
  const [showUpcoming, setShowUpcoming] = useState(false)
  const toggleShowAll = () => {
    setShowUpcoming(!showUpcoming)
  }

  const classSessionInfo = (climbingClass: ClimbingClass) => {
    if (climbingClass.sessionId === currentSession.id) {
      return `${currentSession.name} ${currentSession.year}`
    } else {
      return `${upcomingSession.name} ${upcomingSession.year}`
    }
  }

  const classesToShow = classes.filter((c) => {
    if (showUpcoming && c.sessionId === upcomingSession.id) return true
    return c.sessionId === currentSession.id
  })

  return (
    <>
      <div className='text-center'>
        <h2 className='text-xl font-bold'>Enrolled</h2>
        <Switch.Group>
          <Switch.Label passive className={`p-2`}>
            Show upcoming enrollments
          </Switch.Label>
          <Switch
            checked={showUpcoming}
            onChange={toggleShowAll}
            name='priority'
            className='relative inline-flex h-6 w-11 items-center rounded-full
        ui-checked:bg-sky-800 ui-not-checked:bg-neutral-300'
          >
            <span className='sr-only'>Show All</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                showUpcoming ? 'translate-x-6' : 'translate-x-1'
              }`}
            ></span>
          </Switch>
        </Switch.Group>
        <div className='flex max-w-full items-center justify-center gap-2 overflow-x-scroll p-4'>
          {classesToShow.map((climbingClass) => {
            return (
              <div key={climbingClass.id} className='flex flex-col gap-2'>
                <h2>
                  <em>{classSessionInfo(climbingClass)}</em>
                </h2>
                <ClassCard climbingClass={climbingClass} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

type ClimberDetailOffersProps = {
  offers: Offer[]
}

const ClimberDetailOffers = ({ offers }: ClimberDetailOffersProps) => {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-2'>
      <h2 className='text-xl font-bold'>Offers</h2>
      <div className='flex max-w-full items-center justify-center gap-2 overflow-x-scroll p-4'>
        {offers.map((offer) => {
          return (
            <OfferCard offerId={offer.id} today={new Date()} key={offer.id} />
          )
        })}
      </div>
    </div>
  )
}

type ClimberDetailLogsProps = {
  logs: ClimberLog[]
  climberId: string
}

export const ClimberDetailLogs = ({
  logs,
  climberId,
}: ClimberDetailLogsProps) => {
  const ctx = api.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const clearLogs = api.log.clearLogs.useMutation({
    onMutate: async () => {
      await ctx.log.getClimberLogs.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: async () => {
      await ctx.log.getClimberLogs.invalidate()
      await ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Cleared logs!')
    },
    onError: (e) => {
      toast.error(`Couldn't clear logs: ${e.message}`)
    },
  })

  return (
    <>
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center justify-center gap-2'>
          <h2 className='text-xl font-bold'>Logs</h2>
          <button
            className='flex items-center justify-center'
            onClick={() => toggleIsOpen()}
          >
            <TrashIcon className='h-4 w-4 hover:opacity-75' />
          </button>
        </div>
        <ul className='max-h-56 max-w-full overflow-scroll rounded-lg bg-neutral-700 p-2 shadow-md shadow-neutral-900'>
          {logs.map((log) => {
            return (
              <li key={log.id}>{`${formatLocaleString(
                log.createdAt.toLocaleString()
              )} - ${log.message}`}</li>
            )
          })}
        </ul>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex max-h-[100vh] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex max-h-screen flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6'>
            <h1 className='text-2xl font-bold'>
              This will clear the logs for this climber
            </h1>
            <h2 className='text-lg font-bold'>
              Once cleared, they cannot be recovered
            </h2>
            <h3>Do you wish to continue?</h3>
            <div className='flex w-full justify-evenly gap-2 pt-4'>
              <button
                className='flex-1 rounded-lg bg-green-600 p-2 transition duration-150 hover:scale-95'
                onClick={() => {
                  clearLogs.mutate({
                    climberId: climberId,
                  })
                }}
              >
                Yes
              </button>

              <button
                className='flex-1 rounded-lg bg-red-600 p-2 transition duration-150 ease-in-out hover:scale-95'
                onClick={() => toggleIsOpen()}
              >
                No
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

type ClimberDetailWaitlistEntriesProps = {
  entries: (WaitlistEntry & {
    climber: Climber
    gym: Gym
  })[]
}

const ClimberDetailWaitlistEntries = ({
  entries,
}: ClimberDetailWaitlistEntriesProps) => {
  const [parent] = useAutoAnimate<HTMLDivElement>()
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-2'>
      <h2 className='text-xl font-bold'>Waitlist Entries</h2>
      <div
        ref={parent}
        className='flex max-w-full flex-wrap items-center justify-center gap-2 overflow-x-scroll p-4'
      >
        {entries.map((entry) => {
          return (
            <div key={entry.id} className='text-center'>
              <h3 className={`${entry.gym.cssCode}-text font-bold`}>
                {entry.gym.name}
              </h3>
              <WaitlistDetails entry={entry} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

type ClimberDetailsProps = {
  climber: Climber & {
    classes: (ClimbingClass & {
      climbers: Climber[]
      offers: Offer[]
    })[]
    offers: Offer[]
    waitlistEntries: (WaitlistEntry & {
      climber: Climber
      gym: Gym
    })[]
    logs: ClimberLog[]
  }
}

const ClimberDetails = ({ climber }: ClimberDetailsProps) => {
  const [nameEditOpen, setNameEditOpen] = useState(false)
  const [emailEditOpen, setEmailEditOpen] = useState(false)
  const { isLoading: currentLoading, data: currentSession } =
    api.climbingSession.getCurrent.useQuery()
  const { isLoading: upcomingLoading, data: upcomingSession } =
    api.climbingSession.getUpcoming.useQuery()
  if (currentLoading || upcomingLoading) return <LoadingSpinner />
  if (!currentSession || !upcomingSession)
    return <div>Couldn&apos;t find session data</div>
  return (
    <div className='flex max-h-[95vh] flex-col items-center gap-2 overflow-scroll p-4'>
      <div>
        {nameEditOpen ? (
          <ClimberEditName
            climberId={climber.id}
            climberName={climber.name}
            onRequestClose={() => setNameEditOpen(false)}
          />
        ) : (
          <>
            <ClimberDeleteButton climber={climber} />
            <h1 className='inline p-2 text-2xl font-extrabold'>
              Details for {climber.name}
            </h1>
          </>
        )}
        <button
          className={`transition duration-150 ease-in-out hover:opacity-75 ${
            nameEditOpen ? 'hidden' : ''
          }`}
          onClick={() => {
            setNameEditOpen(true)
          }}
        >
          <PencilSquareIcon className='h-4 w-4' />
        </button>
      </div>
      <ClimberNotesButton climber={climber} />
      {emailEditOpen ? (
        <>
          <ClimberEditEmail
            climberId={climber.id}
            originalEmail={climber.parentEmail}
            onRequestClose={() => setEmailEditOpen(false)}
          />
        </>
      ) : (
        <div className='flex items-center justify-center gap-2'>
          <span>{climber.parentEmail}</span>
          <EmailsButton climbers={[climber]} />
          <button
            className={`transition duration-150 ease-in-out hover:opacity-75 ${
              emailEditOpen ? 'hidden' : ''
            }`}
            onClick={() => {
              setEmailEditOpen(true)
            }}
          >
            <PencilSquareIcon className='h-4 w-4' />
          </button>
        </div>
      )}
      <div className='flex w-full items-center justify-center'>
        {climber.classes.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailClasses
            classes={climber.classes}
            currentSession={currentSession}
            upcomingSession={upcomingSession}
          />
        )}
        {climber.offers.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailOffers offers={climber.offers} />
        )}
      </div>
      <div className='flex items-center justify-center gap-2'>
        {climber.waitlistEntries.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailWaitlistEntries entries={climber.waitlistEntries} />
        )}
        {climber.logs.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailLogs logs={climber.logs} climberId={climber.id} />
        )}
      </div>
    </div>
  )
}

export default ClimberDetails
