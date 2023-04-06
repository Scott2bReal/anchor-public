import { api } from "../../utils/api"

interface Props {
  climberId: string
  gymId: string
  classType: string
}

export const useGetEntriesForClimberAndClassType = ({climberId, gymId, classType}: Props) => {
  return api.waitlist.getEntriesForClimberAndClassType.useQuery({
      climberId: climberId,
      gymId: gymId,
      classType: classType,
    })
}
