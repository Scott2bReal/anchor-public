import { Dialog } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import type { CampWeek, Climber } from '@prisma/client'
import { useState } from 'react'
import CampWaitlistPage from '../pages/camp/waitlist'
import { api } from '../utils/api'
import { formatCampWeekDates } from '../utils/formatCampWeekDates'
import CampWeekDeleteButton from './CampWeekDeleteButton'
import { CampWeekEditDates } from './CampWeekEditDates'
import { CampWeekEditInstructor } from './CampWeekEditInstructor'
import { CloseThisWindowButton } from './ClassInfo'
import { InlineEditPencilButton } from './InlineEditPencilButton'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  campWeek: CampWeek & { climbers: Climber[] }
  onRequestClose: () => void
}

interface SlotInfoProps {
  slots: number
  enrolled: number
}

const Slots = ({ slots, enrolled }: SlotInfoProps) => {
  if (slots - enrolled === 0) return <p className='text-green-500'>Week Full</p>
  return (
    <p>
      {slots - enrolled}/{slots} slots remaining
    </p>
  )
}

export const CampWeekInfo = ({ campWeek, onRequestClose }: Props) => {
  const { isLoading: gymLoading, data: gymInfo } =
    api.gym.getForClassInfo.useQuery({ id: campWeek.gymId })
  const [editWeekOpen, setEditWeekOpen] = useState(false)
  const [instructorOpen, setInstructorOpen] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const toggleWaitlistOpen = () => setWaitlistOpen(!waitlistOpen)

  if (gymLoading) return <LoadingSpinner />
  if (!gymInfo) return <div>Couldn&apos;t find gym</div>

  return (
    <>
      <div className='flex gap-2 p-4'>
        <h1 className={`text-2xl font-bold`}>
          Week {campWeek.weekNumber} - {campWeek.year}
        </h1>
        <CampWeekDeleteButton
          campWeekId={campWeek.id}
          onRequestClose={onRequestClose}
        />
      </div>
      <h2>
        <Slots slots={campWeek.slots} enrolled={campWeek.climbers.length} />
      </h2>
      <ul className='list-disc p-2'>
        <li>
          <span className={`${gymInfo.cssCode}-text`}>{gymInfo.name}</span>
        </li>
        <li>
          <div className='flex items-center justify-start gap-2'>
            {editWeekOpen ? (
              <CampWeekEditDates
                weekId={campWeek.id}
                originalStartDate={campWeek.startDate}
                originalEndDate={campWeek.endDate}
                onRequestClose={() => setEditWeekOpen(false)}
              />
            ) : (
              <>
                {formatCampWeekDates(campWeek)}
                <InlineEditPencilButton
                  openFunction={() => setEditWeekOpen(true)}
                />
              </>
            )}
          </div>
        </li>
        <li>
          {!instructorOpen ? (
            <div className='flex items-center gap-2'>
              <span>Instructor: {campWeek.instructor}</span>
              <button onClick={() => setInstructorOpen(true)}>
                <PencilSquareIcon className='h-4 w-4 transition duration-150 ease-in-out hover:opacity-75' />
              </button>
            </div>
          ) : (
            <CampWeekEditInstructor
              weekId={campWeek.id}
              originalInstructor={campWeek.instructor}
              onRequestClose={() => setInstructorOpen(false)}
            />
          )}
        </li>
      </ul>
      <button
        onClick={() => {
          toggleWaitlistOpen()
        }}
        className='rounded-lg bg-slate-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
      >
        View Waitlist
      </button>
      <Dialog open={waitlistOpen} onClose={() => setWaitlistOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex max-h-[100vh] overflow-scroll p-4'>
          <Dialog.Panel className='z-[4] mx-auto max-h-screen overflow-scroll rounded-lg bg-neutral-900 p-6 text-center'>
            <div className='flex w-full items-center justify-center gap-2 pt-4'>
              <CampWaitlistPage initialFilter={campWeek.id} />
            </div>
            <CloseThisWindowButton
              closeFunction={() => setWaitlistOpen(false)}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
