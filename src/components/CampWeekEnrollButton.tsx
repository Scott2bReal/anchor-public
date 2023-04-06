import type { CampWeek, Climber } from '@prisma/client'
import { useCampEnrollClimber } from '../hooks/camp/useCampEnrollClimber'
import { useGetBasicGymInfo } from '../hooks/gym/useGetBasicGymInfo'
import LoadingSpinner from './LoadingSpinner'

type Props = {
  climber: Climber
  campWeek: CampWeek
  availableForEnrollments: boolean
}

export const CampWeekEnrollButton = ({
  climber,
  campWeek,
  availableForEnrollments,
}: Props) => {
  const { data: gymInfo, isLoading: gymLoading } = useGetBasicGymInfo(
    campWeek.gymId
  )
  const enrollClimber = useCampEnrollClimber({
    climberId: climber.id,
    campWeek: campWeek,
  })

  if (gymLoading)
    return (
      <button
        className={`mx-auto flex-1 rounded-lg bg-gray-800 p-2 opacity-50 shadow-md shadow-neutral-900 hover:scale-95`}
        disabled
      >
        <LoadingSpinner />
      </button>
    )
  if (!gymInfo) return <></>

  return availableForEnrollments ? (
    <button
      className={`mx-auto ${gymInfo.cssCode} flex-1 rounded-lg p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95`}
      onClick={() => {
        enrollClimber.mutate({
          id: climber.id,
          weekId: campWeek.id,
        })
      }}
    >
      Enroll
    </button>
  ) : (
    <button
      className={`mx-auto ${gymInfo.cssCode} flex-1 rounded-lg p-2 opacity-50 shadow-md shadow-neutral-900 transition duration-150 ease-in-out`}
      disabled
    >
      Enroll
    </button>
  )
}
