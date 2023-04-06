import { PencilSquareIcon } from '@heroicons/react/24/outline'
import type {
  CampOffer,
  CampWaitlistEntry,
  CampWeek,
  Climber,
  ClimberLog,
  Gym,
} from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useGetCampInfoForClimber } from '../hooks/climber/useGetCampInfoForClimber'
import { campYearAtom } from '../utils/atoms/campYearAtom'
import { CampOfferCard } from './CampOfferCard'
import { CampWaitlistDetails } from './CampWaitlistDetails'
import { CampWeekCard } from './CampWeekCard'
import { ClimberDeleteButton } from './ClimberDeleteButton'
import { ClimberDetailLogs } from './ClimberDetails'
import { ClimberEditEmail } from './ClimberEditEmail'
import { ClimberEditName } from './ClimberEditName'
import EmailsButton from './EmailsButton'
import LoadingSpinner from './LoadingSpinner'
import { ClimberNotesButton } from './ClimberNotesButton'

type OffersProps = {
  campOffers: CampOffer[]
}

const ClimberDetailOffers = ({ campOffers }: OffersProps) => {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-2'>
      <h2 className='text-xl font-bold'>Offers</h2>
      <div className='flex max-w-full items-center justify-center gap-2 overflow-x-scroll p-4'>
        {campOffers.map((campOffer) => {
          return (
            <CampOfferCard
              offerId={campOffer.id}
              today={new Date()}
              key={campOffer.id}
            />
          )
        })}
      </div>
    </div>
  )
}

interface WeeksProps {
  campWeeks: (CampWeek & {
    climbers: Climber[]
    gym: Gym
    campOffers: CampOffer[]
  })[]
}

const ClimberDetailsCampWeeks = ({ campWeeks }: WeeksProps) => {
  return (
    <>
      <div className='text-center'>
        <h2 className='text-xl font-bold'>Enrolled 🏕️</h2>

        <div className='flex max-w-full items-center justify-center gap-2 overflow-x-scroll p-4'>
          {campWeeks.map((campWeek) => {
            return (
              <CampWeekCard
                campWeek={campWeek}
                key={campWeek.id}
                bgColor={campWeek.gym.cssCode}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

type WaitlistProps = {
  climber: Climber & {
    campWeeks: (CampWeek & {
      campOffers: CampOffer[]
      climbers: Climber[]
      gym: Gym
    })[]
    logs: ClimberLog[]
    campWaitlistEntries: (CampWaitlistEntry & {
      gym: Gym & { campWeeks: CampWeek[] }
      climber: Climber
    })[]
  }
}

const CampClimberDetailWaitlistEntries = ({ climber }: WaitlistProps) => {
  const [year] = useAtom(campYearAtom)
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-2'>
      <h2 className='text-xl font-bold'>Waitlist Entries</h2>
      <div className='flex max-w-full flex-wrap items-center justify-center gap-2 overflow-x-scroll p-4'>
        {climber.campWaitlistEntries.map((entry) => {
          return (
            <div key={entry.id} className='text-center'>
              <h3 className={`${entry.gym.cssCode}-text font-bold`}>
                {entry.gym.name}
              </h3>
              <CampWaitlistDetails
                entry={entry}
                weeks={entry.gym.campWeeks.filter((week) => week.year === year)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Props = {
  climberId: string
}

export const CampClimberDetails = ({ climberId }: Props) => {
  const [nameEditOpen, setNameEditOpen] = useState(false)
  const [emailEditOpen, setEmailEditOpen] = useState(false)
  const [selectedYear] = useAtom(campYearAtom)

  const { data: climber, isLoading: climberLoading } =
    useGetCampInfoForClimber(climberId)

  if (climberLoading) return <LoadingSpinner />
  if (!climber) return <h1>Couldn&apos;t find info for that climber</h1>

  const { campWeeks, campOffers } = climber
  const weeks = campWeeks.filter((week) => week.year === selectedYear)
  const offers = campOffers.filter(
    (offer) => offer.campWeek.year === selectedYear
  )

  return (
    <div className='flex max-h-[95vh] flex-col items-center gap-2 overflow-scroll p-4'>
      <div>
        {nameEditOpen ? (
          <ClimberEditName
            climberId={climber.id}
            climberName={climber.name}
            onRequestClose={() => setNameEditOpen(false)}
          />
        ) : (
          <>
            <ClimberDeleteButton climber={climber} />
            <h1 className='inline p-2 text-2xl font-extrabold'>
              Details for {climber.name}
            </h1>
          </>
        )}
        <button
          className={`transition duration-150 ease-in-out hover:opacity-75 ${
            nameEditOpen ? 'hidden' : ''
          }`}
          onClick={() => {
            setNameEditOpen(true)
          }}
        >
          <PencilSquareIcon className='h-4 w-4' />
        </button>
      </div>

      <ClimberNotesButton climber={climber} />

      {emailEditOpen ? (
        <>
          <ClimberEditEmail
            climberId={climber.id}
            originalEmail={climber.parentEmail}
            onRequestClose={() => setEmailEditOpen(false)}
          />
        </>
      ) : (
        <div className='flex items-center justify-center gap-2'>
          <span>{climber.parentEmail}</span>
          <EmailsButton climbers={[climber]} />
          <button
            className={`transition duration-150 ease-in-out hover:opacity-75 ${
              emailEditOpen ? 'hidden' : ''
            }`}
            onClick={() => {
              setEmailEditOpen(true)
            }}
          >
            <PencilSquareIcon className='h-4 w-4' />
          </button>
        </div>
      )}
      <div className='flex w-full items-center justify-center'>
        {weeks.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailsCampWeeks campWeeks={weeks} />
        )}
        {offers.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailOffers campOffers={offers} />
        )}
      </div>
      <div className='flex items-center justify-center gap-2'>
        {climber.campWaitlistEntries.length === 0 ? (
          <></>
        ) : (
          <CampClimberDetailWaitlistEntries climber={climber} />
        )}
        {climber.logs.length === 0 ? (
          <></>
        ) : (
          <ClimberDetailLogs logs={climber.logs} climberId={climber.id} />
        )}
      </div>
    </div>
  )
}
