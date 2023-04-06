import { api } from '../../utils/api'

export const useGetBasicGymInfo = (gymId: string) => {
  return api.gym.getBasicInfo.useQuery({ gymId: gymId })
}
