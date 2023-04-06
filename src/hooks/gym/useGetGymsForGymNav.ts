import { api } from "../../utils/api"

export const useGetGymsForGymNav = () => {
  return api.gym.getForGymNav.useQuery()
}
