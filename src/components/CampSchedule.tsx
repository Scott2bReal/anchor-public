import { Climber, Gym, CampWeek } from "@prisma/client"
import { CampWeekCard } from "./CampWeekCard"

interface Props {
  gym: (Gym & {campWeeks: (CampWeek & {climbers: Climber[]})[]})
}
export const CampSchedule = ({gym}: Props) => {
  return (
    <div className='flex flex-wrap p-4 mt-8 gap-2'>
      {
        gym.campWeeks.map(campWeek => {
          return <CampWeekCard key={campWeek.id} campWeek={campWeek} />
        })
      }
    </div>
  )
}
