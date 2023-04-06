import { api } from "../../utils/api"

export const useGetGymsForExport = (sessionId: string) => {
  return api.gym.getForExport.useQuery({sessionId: sessionId})
}
