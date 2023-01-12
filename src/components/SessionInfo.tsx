import { Dialog } from "@headlessui/react";
import { ClimbingSession } from "@prisma/client";
import { useState } from "react";
import { CloseThisWindowButton } from "./ClassInfo";
import EnrollmentStats from "./EnrollmentStats";
import { InlineEditPencilButton } from "./InlineEditPencilButton";
import { SessionEditDate } from "./SessionEditDate";
import { SessionEditNotes } from "./SessionEditNotes";

type SessionInfoProps = {
  session: ClimbingSession | null;
}

const SessionInfo = ({ session }: SessionInfoProps) => {
  const [notesEditOpen, setNotesEditOpen] = useState(false)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const toggleStatsOpen = () => setStatsOpen(!statsOpen)

  return session ? (
    <>
      <div className='text-center'>
        <h1 className='text-2xl font-extrabold'>{`${session.name} ${session.year}`}</h1>
        <ul className='text-start p-2'>
          <li>
            {
              startDateOpen
                ?
                <SessionEditDate sessionId={session.id} originalDate={session.startDate} startOrEnd='start' onRequestClose={() => setStartDateOpen(false)} />
                :
                <>
                  <span className='p-2'>Start Date: {session.startDate.toLocaleDateString()}</span>
                  <InlineEditPencilButton openFunction={() => setStartDateOpen(true)} />
                </>
            }
          </li>
          <li>
            {
              endDateOpen
                ?
                <SessionEditDate sessionId={session.id} originalDate={session.endDate} startOrEnd='end' onRequestClose={() => setEndDateOpen(false)} />
                :
                <>
                  <span className='p-2'>End Date: {session.endDate.toLocaleDateString()}</span>
                  <InlineEditPencilButton openFunction={() => setEndDateOpen(true)} />
                </>
            }
          </li>
        </ul>
        {
          notesEditOpen
            ?
            <SessionEditNotes sessionId={session.id} originalNotes={session.notes} onRequestClose={() => setNotesEditOpen(false)} />
            :
            <>
              <h2 className='text-xl font-bold inline p-2'>Session Notes</h2><InlineEditPencilButton openFunction={() => setNotesEditOpen(true)} />
              <p>{session.notes ?? ''}</p>
            </>
        }
        <button
          onClick={() => toggleStatsOpen()}
          className='p-2 mt-2 border-[1px] bg-transparent rounded-lg border-white hover:scale-95 transition duration-150 ease-in-out'
        >
          View Enrollment Stats
        </button>
      </div>
      <Dialog
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 text-center shadow-md shadow-black'
          >
            <EnrollmentStats climbingSession={session} />
            <CloseThisWindowButton closeFunction={() => setStatsOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : (
    <div>No session selected!</div>
  )
}

export default SessionInfo
