import { Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import type { Climber, ClimbingClass } from "@prisma/client";
import { useAtom } from "jotai";
import { useState } from "react";
import WaitlistPage from "../pages/waitlist";
import { api } from "../utils/api";
import { classTypeAtom } from "../utils/atoms/classTypeAtom";
import formatClassTime from "../utils/formatClassTime";
import { ClassCopyToUpcomingButton } from "./ClassCopyToUpcomingButton";
import { ClassEditDay } from "./ClassEditDay";
import { ClassEditTime } from "./ClassEditTime";
import DeleteClassButton from "./DeleteClassButton";
import { InlineEditPencilButton } from "./InlineEditPencilButton";
import InstructorEdit from "./InstructorEdit";
import LoadingSpinner from "./LoadingSpinner";

type ClassInfoProps = {
  climbingClass: ClimbingClass & { climbers: Climber[] };
  onRequestClose: () => void;
};

type SlotInfoProps = {
  slots: number;
  enrolled: number;
};

interface CloseThisWindowButtonProps {
  closeFunction: () => void;
  cancelCenter?: boolean;
}

export const CloseThisWindowButton = ({
  closeFunction,
  cancelCenter,
}: CloseThisWindowButtonProps) => {
  return (
    <button
      onClick={() => closeFunction()}
      className={`w-fit ${
        cancelCenter ? "" : "mx-auto"
      } rounded-lg bg-slate-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95`}
    >
      Close This Window
    </button>
  );
};

const Slots = ({ slots, enrolled }: SlotInfoProps) => {
  if (slots - enrolled === 0)
    return <p className="text-green-500">Class Full</p>;
  return (
    <p>
      {slots - enrolled}/{slots} slots remaining
    </p>
  );
};

const ClassInfo = ({ climbingClass, onRequestClose }: ClassInfoProps) => {
  const { isLoading: gymLoading, data: gymInfo } =
    api.gym.getForClassInfo.useQuery({ id: climbingClass.gymId });
  const { isLoading: sessionLoading, data: sessionInfo } =
    api.climbingSession.getById.useQuery({ id: climbingClass.sessionId });
  const [instructorOpen, setInstructorOpen] = useState(false);
  const [editTimeOpen, setEditTimeOpen] = useState(false);
  const [editDayOpen, setEditDayOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [, setSelectedClassType] = useAtom(classTypeAtom);

  const toggleWaitlistOpen = () => setWaitlistOpen(!waitlistOpen);

  if (gymLoading || sessionLoading) return <LoadingSpinner />;
  if (!gymInfo || !sessionInfo) return <div>Couldn&apos;t find gym</div>;

  const {
    timeZone,
    cssCode,
    className,
    id,
    climbers,
    slots,
    day,
    instructor,
    startTime,
  } = climbingClass;

  return (
    <>
      <div className="flex gap-2 p-4">
        <ClassCopyToUpcomingButton climbingClass={climbingClass} />
        <h1 className={`text-2xl font-bold ${cssCode}-text`}>{className}</h1>
        <DeleteClassButton classId={id} onRequestClose={onRequestClose} />
      </div>
      <h2>
        <Slots slots={slots} enrolled={climbers.length} />
      </h2>
      <ul className="list-disc p-2">
        <li>
          <span className={`${gymInfo.cssCode}-text`}>{gymInfo.name}</span>
        </li>
        <li>
          <span>
            {sessionInfo.name} {sessionInfo.year}
          </span>
        </li>
        <li>
          <div className="flex items-center justify-start gap-2">
            {editDayOpen ? (
              <ClassEditDay
                classId={id}
                originalDay={day}
                classType={className}
                onRequestClose={() => setEditDayOpen(false)}
              />
            ) : (
              <>
                {day}
                <InlineEditPencilButton
                  openFunction={() => setEditDayOpen(true)}
                />
              </>
            )}
          </div>
        </li>
        <li>
          <div className="flex items-center justify-start gap-2">
            {editTimeOpen ? (
              <ClassEditTime
                classId={id}
                classType={className}
                timeZone={timeZone ?? 'America/Chicago'}
                originalTime={startTime}
                onRequestClose={() => setEditTimeOpen(false)}
              />
            ) : (
              <>
                {formatClassTime(
                  climbingClass.startTime,
                  climbingClass.endTime,
                  timeZone ?? 'America/Chicago'
                )}
                <InlineEditPencilButton
                  openFunction={() => setEditTimeOpen(true)}
                />
              </>
            )}
          </div>
        </li>
        <li>
          {!instructorOpen ? (
            <div className="flex items-center gap-2">
              <span>Instructor: {instructor}</span>
              <button onClick={() => setInstructorOpen(true)}>
                <PencilSquareIcon className="h-4 w-4 transition duration-150 ease-in-out hover:opacity-75" />
              </button>
            </div>
          ) : (
            <InstructorEdit
              classId={id}
              originalInstructor={instructor}
              onRequestClose={() => setInstructorOpen(false)}
            />
          )}
        </li>
      </ul>
      <button
        onClick={() => {
          setSelectedClassType(className);
          toggleWaitlistOpen();
        }}
        className="rounded-lg bg-slate-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95"
      >
        View Waitlist
      </button>
      <Dialog open={waitlistOpen} onClose={() => setWaitlistOpen(false)}>
        <div className="fixed inset-0 z-[3] bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 z-[4] flex max-h-[100vh] overflow-scroll p-4">
          <Dialog.Panel className="z-[4] mx-auto max-h-screen overflow-scroll rounded-lg bg-neutral-900 p-6 text-center">
            <div className="flex w-full items-center justify-center gap-2 pt-4">
              <WaitlistPage initialFilter={day} />
            </div>
            <CloseThisWindowButton
              closeFunction={() => setWaitlistOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ClassInfo;
