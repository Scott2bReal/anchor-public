import { Dialog } from "@headlessui/react";
import { ClimbingSession } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { trpc } from "../utils/trpc";

type Props = {
  selected: ClimbingSession;
  onRequestClose: () => void;
}

export const SetUpcomingSessionButton = ({selected, onRequestClose}: Props) => {
  const ctx = trpc.useContext()
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  const setUpcomingSession = trpc.climbingSession.setUpcoming.useMutation({
    onMutate: async () => {
      toast.loading(`Setting upcoming session...`)
      await ctx.climbingSession.getAll.cancel()
      await ctx.climbingSession.getCurrent.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
      ctx.climbingSession.getCurrent.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't set session as upcoming: ${e.message}`)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`${selected.name} ${selected.year} is now the upcoming session`)
      toggleIsOpen()
      onRequestClose()
    }
  })

  return (
    <>
      <button
        className='p-2 rounded-lg bg-purple-800 hover:scale-95 transition duration-150 ease-in shadow-md shadow-black'
        onClick={() => toggleIsOpen()}
      >
        Set As Upcoming
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
            <h1>{`This will set ${selected.name} ${selected.year} session as the upcoming session. Do you wish to continue?`}</h1>
            <div className='flex gap-2 pt-4 justify-evenly'>
              <button
                className='p-2 bg-green-600 rounded-lg flex-1 hover:scale-95 transition duration-150 shadow-md shadow-black'
                onClick={() => {
                  if (!selected) {
                    toast.error("This is not a valid session...")
                    return
                  } else {
                    setUpcomingSession.mutate({
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
