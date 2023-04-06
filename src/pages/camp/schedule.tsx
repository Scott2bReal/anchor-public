import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { CampAddWeekButton } from '../../components/CampAddWeekButton'
import { CampAddWeekForm } from '../../components/CampAddWeekForm'
import { CampSchedule } from '../../components/CampSchedule'
import EmailsButton from '../../components/EmailsButton'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useRedirectForCampPref } from '../../hooks/useRedirectForCampPref'
import { api } from '../../utils/api'
import { gymAtom } from '../../utils/atoms/gymAtom'

const CampSchedulePage = () => {
  const [selectedGym] = useAtom(gymAtom)
  const { data: gym, isLoading: gymLoading } =
    api.gym.getCampWeeksById.useQuery({ gymId: selectedGym })
  const [addNewOpen, setAddNewOpen] = useState(false)
  const toggleAddNewOpen = () => setAddNewOpen(!addNewOpen)
  const [selectedGymId] = useAtom(gymAtom)

  useRedirectForCampPref()

  if (gymLoading) return <LoadingSpinner />
  if (!gym) return <div>Couldn&apos;t find that gym!</div>

  const climbers = gym.campWeeks.map((week) => week.climbers).flat()

  if (gymLoading) return <LoadingSpinner />
  if (!gym) return <div>Couldn&apos;t find that gym</div>

  return (
    <>
      <div className='relative flex max-w-min items-center justify-start gap-2'>
        <EmailsButton climbers={climbers} helpText={true} />
        <CampAddWeekButton toggleFunction={() => toggleAddNewOpen()} />
      </div>
      <Dialog open={addNewOpen} onClose={() => setAddNewOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-4'>
            <CampAddWeekForm
              gymId={selectedGymId}
              onRequestClose={() => setAddNewOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
      <CampSchedule gym={gym} />
    </>
  )
}

export default CampSchedulePage
