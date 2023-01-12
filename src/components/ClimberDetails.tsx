import { Dialog, Switch } from "@headlessui/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Climber, ClimberLog, ClimbingClass, Gym, Offer, WaitlistEntry } from "@prisma/client"
import { useState } from "react";
import toast from "react-hot-toast";
import formatLocaleString from "../utils/formatLocaleString";
import { trpc } from "../utils/trpc";
import ClassCard from "./ClassCard";
import { ClimberDeleteButton } from "./ClimberDeleteButton";
import { ClimberEditEmail } from "./ClimberEditEmail";
import { ClimberEditName } from "./ClimberEditName";
import EmailsButton from "./EmailsButton";
import LoadingSpinner from "./LoadingSpinner";
import OfferCard from "./OfferCard";
import WaitlistDetails from "./WaitlistDetails";

type ClimberDetailClassesProps = {
  classes: (
    ClimbingClass & {
      climbers: Climber[],
      offers: Offer[],
    }
  )[];
  currentSessionId: string;
}

const ClimberDetailClasses = ({ classes, currentSessionId }: ClimberDetailClassesProps) => {
  const [showAll, setShowAll] = useState(false)
  const toggleShowAll = () => setShowAll(!showAll)

  const classesToShow = classes.filter((c) => {
    if (showAll) return true
    return c.sessionId === currentSessionId;
  })

  return (
    <>
      <div className='text-center'>
        <h2 className='text-xl font-bold'>Enrolled</h2>
        <Switch.Group>
          <Switch.Label passive className={`p-2`}>
            {showAll ? 'Show Current' : 'Show All'}
          </Switch.Label>
          <Switch
            checked={showAll}
            onChange={setShowAll}
            onClick={() => toggleShowAll()}
            name='priority'
            className='relative inline-flex h-6 w-11 items-center rounded-full
        ui-checked:bg-sky-800 ui-not-checked:bg-neutral-300'
          >
            <span className='sr-only'>Show All</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${showAll ? 'translate-x-6' : 'translate-x-1'
                }`}
            ></span>
          </Switch>
        </Switch.Group>

        <div className='flex overflow-x-scroll p-4 max-w-full gap-2 justify-center items-center'>
          {classesToShow.map((climbingClass) => {
            return <ClassCard climbingClass={climbingClass} key={climbingClass.id} />
          })}
        </div>
      </div>
    </>
  )
}

type ClimberDetailOffersProps = {
  offers: (
    Offer
  )[];
}

const ClimberDetailOffers = ({ offers }: ClimberDetailOffersProps) => {
  return (
    <div className='flex flex-col justify-center items-center gap-2 flex-1'>
      <h2 className='text-xl font-bold'>Offers</h2>
      <div className='flex overflow-x-scroll p-4 max-w-full gap-2 justify-center items-center'>
        {offers.map((offer) => {
          return <OfferCard offerId={offer.id} today={new Date()} key={offer.id} />
        })}
      </div>
    </div>
  )
}

type ClimberDetailLogsProps = {
  logs: ClimberLog[];
  climberId: string;
}

const ClimberDetailLogs = ({ logs, climberId }: ClimberDetailLogsProps) => {
  const ctx = trpc.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const clearLogs = trpc.logger.clearLogs.useMutation({
    onMutate: async () => {
      await ctx.logger.getClimberLogs.cancel()
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.logger.getClimberLogs.invalidate()
      ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Cleared logs!')
    },
    onError: (e) => {
      toast.error(`Couldn't clear logs: ${e.message}`)
    }
  })

  return (
    <>
      <div className='flex flex-col gap-2 justify-center items-center'>
        <div className='flex gap-2 items-center justify-center'>
          <h2 className='text-xl font-bold'>Logs</h2>
          <button
            className='flex items-center justify-center'
            onClick={() => toggleIsOpen()}
          >
            <TrashIcon className='h-4 w-4 hover:opacity-75' />
          </button>
        </div>
        <ul className='p-2 overflow-scroll max-h-56 max-w-full bg-neutral-700 rounded-lg shadow-md shadow-neutral-900'>
          {
            logs.map((log) => {
              return <li key={log.id}>{`${formatLocaleString(log.createdAt.toLocaleString())} - ${log.message}`}</li>
            })
          }
        </ul>
      </div>
      <Dialog
        open={isOpen} onClose={() => setIsOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center p-4 max-h-[100vh]'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 flex flex-col gap-4 justify-center items-center max-h-screen'
          >

            <h1 className='text-2xl font-bold'>This will clear the logs for this climber</h1>
            <h2 className='text-lg font-bold'>Once cleared, they cannot be recovered</h2>
            <h3>Do you wish to continue?</h3>
            <div className='flex gap-2 pt-4 justify-evenly w-full'>
              <button
                className='p-2 bg-green-600 rounded-lg flex-1 hover:scale-95 transition duration-150'
                onClick={() => {
                  clearLogs.mutate({
                    climberId: climberId,
                  })
                }}
              >Yes</button>

              <button
                className='p-2 bg-red-600 rounded-lg hover:scale-95 flex-1 transition duration-150 ease-in-out'
                onClick={() => toggleIsOpen()}
              >No</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

    </>
  )
}

type ClimberDetailWaitlistEntriesProps = {
  entries: (WaitlistEntry & {
    climber: Climber,
    gym: Gym,
  })[];
}

const ClimberDetailWaitlistEntries = ({ entries }: ClimberDetailWaitlistEntriesProps) => {
  return (
    <div className='flex flex-col justify-center items-center gap-2 flex-1'>
      <h2 className='text-xl font-bold'>Waitlist Entries</h2>
      <div className='flex flex-wrap overflow-x-scroll p-4 max-w-full gap-2 justify-center items-center'>
        {entries.map((entry) => {
          return (
            <div key={entry.id} className='text-center'>
              <h3 className={`${entry.gym.cssCode}-text font-bold`}>{entry.gym.name}</h3>
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
      climbers: Climber[],
      offers: Offer[],
    })[],
    offers: Offer[],
    waitlistEntries: (WaitlistEntry & {
      climber: Climber,
      gym: Gym,
    })[],
    logs: ClimberLog[],
  };
}

const ClimberDetails = ({ climber }: ClimberDetailsProps) => {
  const [nameEditOpen, setNameEditOpen] = useState(false)
  const [emailEditOpen, setEmailEditOpen] = useState(false)
  const { isLoading: sessionIdLoading, data: currentSessionId } = trpc.climbingSession.getCurrentId.useQuery()
  if (sessionIdLoading || !currentSessionId) return <LoadingSpinner />
  return (
    <div className='flex flex-col items-center gap-2 max-h-[95vh] p-4 overflow-scroll'>
      <div>
        {
          nameEditOpen
            ?
            <ClimberEditName climberId={climber.id} climberName={climber.name} onRequestClose={() => setNameEditOpen(false)} />
            :
            <>
              <ClimberDeleteButton climber={climber} />
              <h1 className='inline p-2 text-2xl font-extrabold'>Details for {climber.name}</h1>
            </>
        }
        <button
          className={`hover:opacity-75 transition duration-150 ease-in-out ${nameEditOpen ? 'hidden' : ''}`}
          onClick={() => {
            setNameEditOpen(true)
          }}
        >
          <PencilSquareIcon className='h-4 w-4' />
        </button>
      </div>
      {
        emailEditOpen
          ?
          <>
            <ClimberEditEmail climberId={climber.id} originalEmail={climber.parentEmail} onRequestClose={() => setEmailEditOpen(false)} />
          </>
          :
          <div className='flex gap-2 items-center justify-center'>
            <span>{climber.parentEmail}</span>
            <EmailsButton climbers={[climber]} />
            <button
              className={`hover:opacity-75 transition duration-150 ease-in-out ${emailEditOpen ? 'hidden' : ''}`}
              onClick={() => {
                setEmailEditOpen(true)
              }}
            >
              <PencilSquareIcon className='h-4 w-4' />
            </button>
          </div>
      }
      <div className='flex justify-center items-center w-full'>
        {climber.classes.length === 0 ? <></> : <ClimberDetailClasses classes={climber.classes} currentSessionId={currentSessionId.id} />}
        {climber.offers.length === 0 ? <></> : <ClimberDetailOffers offers={climber.offers} />}
      </div>
      <div className='flex gap-2 justify-center items-center'>
        {climber.waitlistEntries.length === 0 ? <></> : <ClimberDetailWaitlistEntries entries={climber.waitlistEntries} />}
        {climber.logs.length === 0 ? <></> : <ClimberDetailLogs logs={climber.logs} climberId={climber.id} />}
      </div>
    </div>
  )
}

export default ClimberDetails
