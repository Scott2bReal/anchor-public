import { Dialog } from "@headlessui/react"
import { useAtom } from "jotai"
import { useState } from "react"
import { CampAddWeekButton } from "../components/CampAddWeekButton"
import { CampAddWeekForm } from "../components/CampAddWeekForm"
import { CampSchedule } from "../components/CampSchedule"
import EmailsButton from "../components/EmailsButton"
import LoadingSpinner from "../components/LoadingSpinner"
import { gymAtom } from "../utils/atoms/gymAtom"
import { trpc } from "../utils/trpc"

const Camp = () => {
  const [addNewOpen, setAddNewOpen] = useState(false)
  const toggleAddNewOpen = () => setAddNewOpen(!addNewOpen)
  const [selectedGymId] = useAtom(gymAtom)
  const {data: gym, isLoading: gymLoading} = trpc.gyms.getCampWeeksById.useQuery({gymId: selectedGymId})

  if (gymLoading) return <LoadingSpinner />
  if (!gym) return <div>Couldn&apos;t find that gym!</div>

  const climbers = gym.campWeeks.map(week => week.climbers).flat()

  return (
    <>
      <div className='flex relative justify-start gap-2 max-w-min items-center'>
        <EmailsButton climbers={climbers} helpText={true} />
        <CampAddWeekButton toggleFunction={() => toggleAddNewOpen()} />
      </div>
      <Dialog
        open={addNewOpen}
        onClose={() => setAddNewOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-4'
          >
            <CampAddWeekForm gymId={selectedGymId} onRequestClose={() => setAddNewOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
      <CampSchedule gym={gym} />
    </>
  )
}

export default Camp
