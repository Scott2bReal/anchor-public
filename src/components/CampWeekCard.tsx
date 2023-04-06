import { Dialog } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import type { CampOffer, CampWeek, Climber } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import useFindClimber from '../hooks/useFindClimber'
import { climberAtom } from '../utils/atoms/climberAtom'
import { formatCampWeekDates } from '../utils/formatCampWeekDates'
import { CampOfferButton } from './CampOfferButton'
import { CampOfferList } from './CampOfferList'
import { CampWeekEnrollButton } from './CampWeekEnrollButton'
import { CampWeekInfo } from './CampWeekInfo'
import { CampWeekRoster } from './CampWeekRoster'
import { CloseThisWindowButton } from './ClassInfo'
import Search from './Search'

interface Props {
  campWeek: CampWeek & { climbers: Climber[]; campOffers: CampOffer[] }
  bgColor: string
}

export const CampWeekCard = ({ campWeek, bgColor }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedClimberId] = useAtom(climberAtom)
  const { data: climber } = useFindClimber(selectedClimberId)

  const availableForEnrollments = campWeek.climbers.length < campWeek.slots
  const availableForOffers =
    campWeek.climbers.length + campWeek.campOffers.length < campWeek.slots

  interface CampWeekCardSlotsProps {
    slots: number
    enrolled: number
  }

  const ClassCardSlots = ({ slots, enrolled }: CampWeekCardSlotsProps) => {
    return slots - enrolled === 0 ? (
      <></>
    ) : (
      <span className='text-xs'>
        {enrolled}/{slots}
      </span>
    )
  }

  interface OpeningsIconProps {
    campWeek: CampWeek & {
      climbers: Climber[]
    }
  }

  const OpeningsIcon = ({ campWeek }: OpeningsIconProps) => {
    return (
      <div className='flex items-center gap-1'>
        <ExclamationCircleIcon className='h-3 w-3 text-red-500' />
        <ClassCardSlots
          slots={campWeek.slots}
          enrolled={campWeek.climbers.length}
        />
      </div>
    )
  }

  interface OffersIconProps {
    campWeek: CampWeek & {
      climbers: Climber[]
      campOffers: CampOffer[]
    }
  }

  const OffersIcon = ({ campWeek }: OffersIconProps) => {
    const totalOffers = campWeek.campOffers.length

    return (
      <div className='flex items-center gap-1'>
        <ExclamationCircleIcon className='h-3 w-3 text-yellow-400' />
        <span className='text-xs'>{totalOffers}</span>
      </div>
    )
  }

  const isFull = (campWeek: CampWeek & { climbers: Climber[] }) => {
    return campWeek.slots - campWeek.climbers.length === 0
  }

  return (
    <>
      <div
        className={`min-h-[120px] min-w-[120px] ${bgColor} relative rounded-md p-2 text-center align-middle shadow-md shadow-neutral-900 transition duration-150 ease-out hover:scale-105 hover:cursor-pointer`}
        onClick={() => setIsOpen(true)}
      >
        <div className='alerts absolute right-2 top-0 flex gap-2'>
          {isFull(campWeek) ? <></> : <OpeningsIcon campWeek={campWeek} />}
          {campWeek.campOffers && campWeek.campOffers.length > 0 ? (
            <OffersIcon campWeek={campWeek} />
          ) : (
            <></>
          )}
        </div>
        <h2 className='pt-1 text-lg font-bold'>Week {campWeek.weekNumber}</h2>
        <ul>
          <li>{formatCampWeekDates(campWeek)}</li>
          <li className='font-bold'>{campWeek.instructor}</li>
        </ul>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='relative z-[4] mx-auto flex h-[95vh] flex-col items-center overflow-scroll rounded-lg bg-neutral-800 p-6 shadow-md shadow-neutral-900'>
            <CampWeekInfo
              campWeek={campWeek}
              onRequestClose={() => setIsOpen(false)}
            />
            <div className='relative flex h-max flex-col items-center justify-center gap-2'>
              <div className='flex justify-center'>
                <CampWeekRoster campWeek={campWeek} />
                {campWeek.campOffers.length > 0 ? (
                  <div className='flex h-full flex-col justify-between'>
                    <CampOfferList weekId={campWeek.id} />
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
                    Enroll or Make an Offer for{' '}
                    <span className='font-extrabold'>{climber.name}</span>
                  </h2>
                ) : (
                  <></>
                )}
              </div>
              <div className='mb-4 flex w-full gap-4'>
                {climber ? (
                  <CampWeekEnrollButton
                    climber={climber}
                    campWeek={campWeek}
                    availableForEnrollments={availableForEnrollments}
                  />
                ) : (
                  <></>
                )}
                {climber ? (
                  <CampOfferButton
                    climber={climber}
                    campWeek={campWeek}
                    availableForOffers={availableForOffers}
                  />
                ) : (
                  <></>
                )}
              </div>
              <CloseThisWindowButton closeFunction={() => setIsOpen(false)} />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
