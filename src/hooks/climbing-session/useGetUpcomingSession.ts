import { api } from "../../utils/api"

export const useGetUpcomingSession = () => {
  return api.climbingSession.getUpcoming.useQuery()
}
