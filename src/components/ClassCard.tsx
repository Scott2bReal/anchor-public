import { Dialog } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import type { Climber, ClimbingClass, Offer } from "@prisma/client";
import { useAtom } from "jotai";
import { useRef, useState } from "react";
import useFindClimber from "../hooks/useFindClimber";
import { climberAtom } from "../utils/atoms/climberAtom";
import formatClassTime from "../utils/formatClassTime";
import isFull from "../utils/isFull";
import ClassInfo from "./ClassInfo";
import ClassRoster from "./ClassRoster";
import EnrollClimberButton from "./EnrollClimberButton";
import OfferButton from "./OfferButton";
import OfferList from "./OfferList";
import Search from "./Search";

interface ClimbingClassCardProps {
  climbingClass: ClimbingClass & { climbers: Climber[]; offers: Offer[] };
}

interface ClassCardSlotsProps {
  slots: number;
  enrolled: number;
}

const ClassCardSlots = ({ slots, enrolled }: ClassCardSlotsProps) => {
  return slots - enrolled === 0 ? (
    <></>
  ) : (
    <span className="text-xs">
      {enrolled}/{slots}
    </span>
  );
};

interface OpeningsIconProps {
  climbingClass: ClimbingClass & {
    climbers: Climber[];
    offers: Offer[];
  };
}

const OpeningsIcon = ({ climbingClass }: OpeningsIconProps) => {
  return (
    <div className="flex items-center gap-1">
      <ExclamationCircleIcon className="h-3 w-3 text-red-500" />
      <ClassCardSlots
        slots={climbingClass.slots}
        enrolled={climbingClass.climbers.length}
      />
    </div>
  );
};

interface OffersIconProps {
  climbingClass: ClimbingClass & {
    climbers: Climber[];
    offers: Offer[];
  };
}

const OffersIcon = ({ climbingClass }: OffersIconProps) => {
  const totalOffers = climbingClass.offers.length;

  return (
    <div className="flex items-center gap-1">
      <ExclamationCircleIcon className="h-3 w-3 text-yellow-400" />
      <span className="text-xs">{totalOffers}</span>
    </div>
  );
};

const ClassCard = ({ climbingClass }: ClimbingClassCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClimberId] = useAtom(climberAtom);
  const buttonRef = useRef(null);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  const { data: climber } = useFindClimber(selectedClimberId);

  const availableForOffers =
    climbingClass.climbers.length + climbingClass.offers.length <
    climbingClass.slots;
  const availableForEnrollments =
    climbingClass.climbers.length < climbingClass.slots;

  return (
    <>
      <div
        className={`${climbingClass.cssCode} relative rounded-md p-2 text-center align-middle shadow-md shadow-neutral-900 transition duration-150 ease-out hover:scale-105 hover:cursor-pointer`}
        onClick={() => setIsOpen(true)}
      >
        <div className="alerts absolute right-2 top-0 flex gap-2">
          {isFull(climbingClass) ? (
            <></>
          ) : (
            <OpeningsIcon climbingClass={climbingClass} />
          )}
          {climbingClass.offers && climbingClass.offers.length > 0 ? (
            <OffersIcon climbingClass={climbingClass} />
          ) : (
            <></>
          )}
        </div>
        <h2 className="text-lg">{climbingClass.className}</h2>
        <ul>
          <li className="text-sm font-bold">{climbingClass.instructor}</li>
          <li className="text-xs">
            {formatClassTime(
              climbingClass.startTime,
              climbingClass.endTime,
              climbingClass.timeZone ?? 'America/Chicago'
            )}
          </li>
        </ul>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocus={buttonRef}
      >
        <div className="fixed inset-0 z-[3] bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 z-[4] flex items-center justify-center rounded-lg p-4">
          <Dialog.Panel className="relative z-[4] mx-auto flex h-[95vh] flex-col items-center overflow-scroll rounded-lg bg-neutral-800 p-6 shadow-md shadow-neutral-900">
            <ClassInfo
              climbingClass={climbingClass}
              onRequestClose={toggleIsOpen}
            />
            <div className="relative flex h-max flex-col items-center justify-center gap-2">
              <div className="flex justify-center">
                <ClassRoster climbingClass={climbingClass} />
                {climbingClass.offers.length > 0 ? (
                  <div className="flex h-full flex-col justify-between">
                    <OfferList classId={climbingClass.id} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div
                className={`flex flex-col items-center justify-center gap-2`}
              >
                {climber ? <></> : <h2>Select a Climber below</h2>}
                <Search />
                {climber ? (
                  <h2>
                    Enroll or Make an Offer for{" "}
                    <span className="font-extrabold">{climber.name}</span>
                  </h2>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex w-full gap-4">
                {climber ? (
                  <EnrollClimberButton
                    climber={climber}
                    climbingClass={climbingClass}
                    availableForEnrollments={availableForEnrollments}
                  />
                ) : (
                  <></>
                )}
                {climber ? (
                  <OfferButton
                    climber={climber}
                    climbingClass={climbingClass}
                    availableForOffers={availableForOffers}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ClassCard;
