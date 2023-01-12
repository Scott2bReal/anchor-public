import { Dialog } from "@headlessui/react";
import { ClimbingSession } from "@prisma/client";
import { useAtom } from "jotai";
import { useState } from "react";
import toast from "react-hot-toast";
import { sessionAtom } from "../utils/atoms/sessionAtom";
import { trpc } from "../utils/trpc";

type DeleteSessionButtonProps = {
  selected: ClimbingSession;
  current: ClimbingSession;
  onRequestClose: () => void;
}

const DeleteSessionButton = ({ current, selected, onRequestClose }: DeleteSessionButtonProps) => {
  const ctx = trpc.useContext()
  const [, setSelectedSession] = useAtom(sessionAtom)
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const deleteSession = trpc.climbingSession.delete.useMutation({
    onMutate: async () => {
      toast.loading('Deleting session...')
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: () => ctx.climbingSession.getAll.invalidate(),
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't delete session: ${e.message}`)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Deleted ${selected.name} ${selected.year}`)
      toggleIsOpen()
      onRequestClose()
      setSelectedSession(current)
    }
  })

  return (
    <>
      <button
        className='p-2 rounded-lg bg-red-800 hover:scale-95 transition duration-150 ease-in shadow-md shadow-black'
        onClick={() => toggleIsOpen()}
      >
        Delete Selected Session
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'
          >
            <h1>Warning! This will delete the {`${selected.name} ${selected.year} session. Do you wish to continue?`}</h1>
            <div className='flex gap-2 pt-4 justify-evenly'>
              <button
                className='p-2 bg-green-600 rounded-lg flex-1 hover:scale-95 transition duration-150 shadow-md shadow-black'
                onClick={() => {
                  if (!selected) {
                    toast.error("Please select a session which is not the current session")
                    return
                  } else {
                    deleteSession.mutate({
                      id: selected.id
                    })
                  }
                }}
              >Yes</button>

              <button
                className='p-2 bg-red-600 rounded-lg hover:scale-95 flex-1 transition duration-150 ease-in-out shadow-md shadow-black'
                onClick={() => toggleIsOpen()}
              >No</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteSessionButton
