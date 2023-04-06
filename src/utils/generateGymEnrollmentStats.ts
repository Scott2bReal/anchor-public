import type { Climber, ClimbingClass } from "@prisma/client";

export function generateGymEnrollmentStats(
  climbingClasses: (ClimbingClass & { climbers: Climber[] })[]
) {
  const gymStats = climbingClasses.reduce((statsObject: Record<string, number>, climbingClass) => {
    if (Object.hasOwn(statsObject, climbingClass.className)) {
      statsObject[climbingClass.className] += climbingClass.climbers.length
    } else {
      statsObject[climbingClass.className] = climbingClass.climbers.length
    }

    return statsObject
  }, {})

  return gymStats
}
