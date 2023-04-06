import { api } from "../../utils/api"

export const useGetCampWaitlistByClimber = (climberId: string) => {
  return api.campWaitlist.getByClimber.useQuery({ climberId: climberId })
}
