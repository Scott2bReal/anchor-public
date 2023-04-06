import { api } from "../../utils/api"

export const useGetCurrentSession = () => {
  return api.climbingSession.getCurrent.useQuery()
}
