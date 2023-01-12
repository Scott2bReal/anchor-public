import { Dialog } from "@headlessui/react"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"
import { User } from "@prisma/client"
import { useState } from "react"
import { trpc } from "../utils/trpc"
import LoadingSpinner from "./LoadingSpinner"
import { UserControls } from "./UserControls"

interface Props {
  user: User
}

export const UserControlsButton = ({user}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)
  const {data: userDefaultSession, isLoading: defaultLoading} = trpc.climbingSession.getById.useQuery({id: user?.defaultSessionId ?? ''})


  if (defaultLoading) return <LoadingSpinner />
  if (!user || !userDefaultSession) return <div>You must be logged in</div>

  return (
    <>
      <button
        onClick={() => toggleIsOpen()}
        className='rounded-md border-gray-800 bg-slate-700 transition p-2 shadow-md shadow-neutral-900 hover:scale-95 ease-out text-center mx-auto flex gap-2'
      >
        <WrenchScrewdriverIcon className='h-6 w-6' />
      </button>
      <Dialog
        open={isOpen} onClose={() => setIsOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center p-4 max-h-[100vh]'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 max-h-screen text-center'
          >
            <UserControls user={user} onRequestClose={() => setIsOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
