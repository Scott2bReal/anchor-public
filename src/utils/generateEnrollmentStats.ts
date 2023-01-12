import { Climber, ClimbingClass } from "@prisma/client";
import { generateGymEnrollmentStats } from "./generateGymEnrollmentStats";

export function generateEnrollmentStats(
  climbingClasses: (ClimbingClass & { climbers: Climber[] })[],
  gyms: { id: string, name: string, cssCode: string }[]
) {
  const allGymsStats = generateGymEnrollmentStats(climbingClasses)

  const gymStats = gyms.reduce((statsObj: Record<string, Record<string, number>>, gym) => {
    statsObj[gym.name] = generateGymEnrollmentStats(climbingClasses.filter(c => c.gymId === gym.id))
    return statsObj
  }, {})

  gymStats.allGyms = allGymsStats
  return gymStats;
}
