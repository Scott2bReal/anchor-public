import { api } from "../../utils/api"

export const useGetGymForClassInfo = (gymId: string) => {
  return api.gym.getForClassInfo.useQuery({ id: gymId })
}
