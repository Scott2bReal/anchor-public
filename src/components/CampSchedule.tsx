import { useAutoAnimate } from '@formkit/auto-animate/react'
import type { CampOffer, CampWeek, Climber, Gym } from '@prisma/client'
import { useAtom } from 'jotai'
import { campYearAtom } from '../utils/atoms/campYearAtom'
import { CampWeekCard } from './CampWeekCard'

interface Props {
  gym: Gym & {
    campWeeks: (CampWeek & { climbers: Climber[]; campOffers: CampOffer[] })[]
  }
}

export const CampSchedule = ({ gym }: Props) => {
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const [selectedYear] = useAtom(campYearAtom)

  const { campWeeks, cssCode } = gym
  const weeks = campWeeks.filter((week) => week.year === selectedYear)

  return (
    <div
      ref={parent}
      className='mt-8 grid w-full max-w-fit grid-cols-3 gap-2 p-4'
    >
      {weeks.map((week) => {
        return <CampWeekCard key={week.id} campWeek={week} bgColor={cssCode} />
      })}
    </div>
  )
}
