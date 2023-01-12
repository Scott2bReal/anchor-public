import { Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { Climber, ClimbingClass } from "@prisma/client"
import { useAtom } from "jotai";
import { useState } from "react";
import WaitlistPage from "../pages/waitlist";
import { classTypeAtom } from "../utils/atoms/classTypeAtom";
import formatClassTime from "../utils/formatClassTime";
import { trpc } from "../utils/trpc";
import { ClassEditDay } from "./ClassEditDay";
import { ClassEditTime } from "./ClassEditTime";
import DeleteClassButton from "./DeleteClassButton";
import { InlineEditPencilButton } from "./InlineEditPencilButton";
import InstructorEdit from "./InstructorEdit";
import LoadingSpinner from "./LoadingSpinner";

type ClassInfoProps = {
  climbingClass: ClimbingClass & { climbers: Climber[] }
  onRequestClose: () => void;
}

type SlotInfoProps = {
  slots: number;
  enrolled: number;
}

interface CloseThisWindowButtonProps {
  closeFunction: () => void;
}

export const CloseThisWindowButton = ({ closeFunction }: CloseThisWindowButtonProps) => {
  return (
    <button
      onClick={() => closeFunction()}
      className='p-2 bg-slate-800 rounded-lg shadow-md shadow-neutral-900 hover:scale-95 transition duration-150 ease-in-out'
    >
      Close This Window
    </button>
  )
}

const Slots = ({ slots, enrolled }: SlotInfoProps) => {
  if (slots - enrolled === 0) return <p className='text-green-500'>Class Full</p>

  return <p>{slots - enrolled}/{slots} slots remaining</p>
}

const ClassInfo = ({ climbingClass, onRequestClose }: ClassInfoProps) => {
  const { isLoading: gymLoading, data: gymInfo } = trpc.gyms.getForClassInfo.useQuery({ id: climbingClass.gymId });
  const { isLoading: sessionLoading, data: sessionInfo } = trpc.climbingSession.getById.useQuery({ id: climbingClass.sessionId })
  const [instructorOpen, setInstructorOpen] = useState(false);
  const [editTimeOpen, setEditTimeOpen] = useState(false);
  const [editDayOpen, setEditDayOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [, setSelectedClassType] = useAtom(classTypeAtom)

  const toggleWaitlistOpen = () => setWaitlistOpen(!waitlistOpen);

  if (gymLoading || sessionLoading) return <LoadingSpinner />
  if (!gymInfo || !sessionInfo) return <div>Couldn&apos;t find gym</div>

  return (
    <>
      <div className='flex gap-2 p-4'>
        <h1 className={`font-bold text-2xl ${climbingClass.cssCode}-text`}>{climbingClass.className}</h1>
        <DeleteClassButton classId={climbingClass.id} onRequestClose={onRequestClose} />
      </div>
      <h2><Slots slots={climbingClass.slots} enrolled={climbingClass.climbers.length} /></h2>
      <ul className='list-disc p-2'>
        <li><span className={`${gymInfo.cssCode}-text`}>{gymInfo.name}</span></li>
        <li><span>{sessionInfo.name} {sessionInfo.year}</span></li>
        <li>
          <div className='flex gap-2 justify-start items-center'>
            {
              editDayOpen
                ?
                <ClassEditDay classId={climbingClass.id} originalDay={climbingClass.day} classType={climbingClass.className} onRequestClose={() => setEditDayOpen(false)} />
                :
                <>
                  {climbingClass.day}
                  <InlineEditPencilButton openFunction={() => setEditDayOpen(true)} />
                </>
            }
          </div>
        </li>
        <li>
          <div className='flex gap-2 justify-start items-center'>
            {
              editTimeOpen
                ?
                <ClassEditTime
                  classId={climbingClass.id}
                  classType={climbingClass.className}
                  originalTime={climbingClass.startTime}
                  onRequestClose={() => setEditTimeOpen(false)}
                />
                :
                <>
                  {formatClassTime(climbingClass.startTime, climbingClass.endTime)}
                  <InlineEditPencilButton openFunction={() => setEditTimeOpen(true)} />
                </>
            }
          </div>
        </li>
        <li>
          {
            !instructorOpen
              ?
              (
                <div className='flex items-center gap-2'>
                  <span>Instructor: {climbingClass.instructor}</span>
                  <button
                    onClick={() => setInstructorOpen(true)}
                  >
                    <PencilSquareIcon className='h-4 w-4 hover:opacity-75 duration-150 transition ease-in-out' />
                  </button>
                </div>
              )
              :
              (
                <InstructorEdit
                  classId={climbingClass.id}
                  originalInstructor={climbingClass.instructor}
                  onRequestClose={() => setInstructorOpen(false)}
                />
              )
          }
        </li>
      </ul>
      <button
        onClick={() => {
          setSelectedClassType(climbingClass.className)
          toggleWaitlistOpen()
        }}
        className='p-2 bg-slate-800 rounded-lg shadow-md shadow-neutral-900 hover:scale-95 transition duration-150 ease-in-out'
      >
        View Waitlist
      </button>
      <Dialog
        open={waitlistOpen} onClose={() => setWaitlistOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 flex p-4 max-h-[100vh] overflow-scroll'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 max-h-screen overflow-scroll text-center'
          >

            <div className='flex gap-2 pt-4 w-full justify-center items-center'>
              <WaitlistPage />
            </div>
            <CloseThisWindowButton closeFunction={() => setWaitlistOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default ClassInfo
