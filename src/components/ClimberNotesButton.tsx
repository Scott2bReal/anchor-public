import { Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import type { Climber } from "@prisma/client";
import { useState } from "react";
import ClimberEditNotes from "./ClimberEditNotes";

interface Props {
  climber: Climber;
}

export const ClimberNotesButton = ({ climber }: Props) => {
  const { notes, name, id } = climber;
  const [isOpen, setIsOpen] = useState(false);
  const [editNotesOpen, setEditNotesOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <>
      <button
        className="pointer-events-auto rounded-lg bg-slate-800 p-1 px-2 text-neutral-100 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95"
        onClick={() => toggleOpen()}
      >
        View Notes
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 z-[3] bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 z-[4] flex max-h-[95vh] p-4">
          <Dialog.Panel className="z-[4] m-auto flex h-fit max-h-[95vh] min-h-[50vh] max-w-full flex-col items-center justify-between overflow-scroll rounded-lg bg-neutral-800 p-6 shadow-md shadow-neutral-900">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-300">
                Notes for {name}
              </h2>
              <button
                onClick={() => setEditNotesOpen(!editNotesOpen)}
                className="mx-auto mt-2 block w-fit rounded-lg bg-gray-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            </div>
            {editNotesOpen ? (
              <ClimberEditNotes
                originalNotes={notes}
                climberId={id}
                onRequestClose={() => setEditNotesOpen(false)}
              />
            ) : (
              <p>{notes}</p>
            )}
            <button
              className="mx-auto mt-2 block w-fit rounded-lg bg-gray-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95"
              onClick={() => toggleOpen()}
            >
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
