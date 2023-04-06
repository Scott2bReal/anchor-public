import { api } from "../../utils/api"

export const useGetCampInfoForClimber = (climberId: string) => {
  return api.climber.getCampInfo.useQuery({ climberId: climberId })
}
