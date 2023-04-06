import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { useGetCampOfferById } from '../hooks/camp-offer/useGetCampOfferById'
import { CampOfferInfo } from './CampOfferInfo'
import { CampWeekCard } from './CampWeekCard'
import LoadingSpinner from './LoadingSpinner'

interface OfferCardProps {
  offerId: string
  today: Date
}

export const CampOfferCard = ({ offerId, today }: OfferCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const { isLoading, data: campOffer } = useGetCampOfferById(offerId)

  if (isLoading) return <LoadingSpinner />
  if (!campOffer) return <div>No offer with that id...</div>

  const backgroundColor =
    campOffer.expiration > today ? campOffer.gym.cssCode : 'expired'

  return (
    <>
      <div
        className={`${backgroundColor} rounded-lg p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-105 hover:cursor-pointer`}
        onClick={() => toggleIsOpen()}
      >
        <ul>
          <li>
            <strong>Climber:</strong> {campOffer.climber.name}
          </li>
          <li>
            <strong>Made by:</strong> {campOffer.user.name ?? 'Someone'}
          </li>
          <li>
            <strong>On:</strong> {campOffer.createdAt.toLocaleDateString()}
          </li>
          <li>
            <strong>Expires:</strong>{' '}
            {campOffer.expiration.toLocaleDateString()}
          </li>
        </ul>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-2 rounded-lg bg-neutral-900 p-6 shadow-md shadow-neutral-900'>
            <CampOfferInfo campOffer={campOffer} />
            <h2 className='text-lg font-bold'>Offered Week</h2>
            <CampWeekCard
              campWeek={campOffer.campWeek}
              bgColor={campOffer.gym.cssCode}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
