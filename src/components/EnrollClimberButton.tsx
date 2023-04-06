import type { Climber, ClimbingClass } from '@prisma/client'
import { useEnrollClimber } from '../hooks/climber/useEnrollClimber'

type EnrollClimberButtonProps = {
  climber: Climber
  climbingClass: ClimbingClass
  availableForEnrollments: boolean
}

export default function EnrollClimberButton({
  climber,
  climbingClass,
  availableForEnrollments,
}: EnrollClimberButtonProps) {
  const enrollClimber = useEnrollClimber({
    climber: climber,
    climbingClass: climbingClass,
  })

  return availableForEnrollments ? (
    <button
      className={`flex-1 rounded-lg p-2 ${climbingClass.cssCode} shadow-md shadow-neutral-900 transition duration-150 hover:scale-95`}
      onClick={() => {
        enrollClimber.mutate({
          id: climber.id,
          classId: climbingClass.id,
        })
      }}
    >
      Enroll
    </button>
  ) : (
    <button
      className={`flex-1 rounded-lg p-2 opacity-50 ${climbingClass.cssCode} shadow-md shadow-neutral-900`}
      disabled
    >
      Enroll
    </button>
  )
}
