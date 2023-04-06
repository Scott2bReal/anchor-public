import type { Climber, ClimbingClass } from "@prisma/client";

export default function isFull(climbingClass: ClimbingClass & {climbers: Climber[]}) {
  return climbingClass.slots - climbingClass.climbers.length === 0
}
