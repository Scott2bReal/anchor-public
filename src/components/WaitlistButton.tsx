import { Dialog } from "@headlessui/react"
import { UserPlusIcon } from "@heroicons/react/20/solid"
import { useAtom } from "jotai"
import { useState } from "react"
import { sessionAtom } from "../utils/atoms/sessionAtom"
import { cssClassTypeCodes } from "../utils/cssClassTypeCodes"
import WaitlistForm from "./WaitlistForm"

type WaitlistButtonProps = {
  climberId: string,
  gymId: string,
  classType: string;
}

const WaitlistButton = ({ climberId, gymId, classType }: WaitlistButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)
  const [selectedSession] = useAtom(sessionAtom)

  return selectedSession ? ( <>
    <button
      onClick={() => setIsOpen(true)}
      className={`shadow-md shadow-neutral-900 flex gap-2 justify-center items-center pointer-events-auto rounded-lg ${cssClassTypeCodes[classType]} p-1 text-slate-900 hover:scale-95 transition-colors duration-500 ease-in-out`}
    >
      Add to Waitlist
      <UserPlusIcon className="w-6 h-6" />
    </button>
    <Dialog
      open={isOpen} onClose={() => setIsOpen(false)}
    >
      <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
      <div
        className='z-[4] fixed inset-0 items-center flex justify-center p-4'
      >
        <Dialog.Panel
          className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6'
        >
          <WaitlistForm climberId={climberId} gymId={gymId} closeOnRequest={toggleOpen} classType={classType} />
        </Dialog.Panel>

      </div>
    </Dialog>
  </>
  ) : (
    <div>Please select a session</div>
  )
}

export default WaitlistButton
